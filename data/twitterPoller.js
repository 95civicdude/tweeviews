var dbConnection = require("./dbConnection.js");
var twitter = require("twitter");
var bvsubmit = require("bvsubmit");

var clientNameToInterval = {};
var clientNameToTwitter = {};
var hashTagToRating = {
    "1star" :     1, "2star" :     2, "3star" :       3, "4star" :      4, "5star" :      5,
    "1stars" :    1, "2stars" :    2, "3stars" :      3, "4stars" :     4, "5stars" :     5,
    "onestar" :   1, "twostar" :   2, "threestar" :   3, "fourstar" :   4, "fivestar" :   5,
    "onestars" :  1, "twostars" :  2, "threestars" :  3, "fourstars" :  4, "fivestars" :  5,
    "one_star" :  1, "two_star" :  2, "three_star" :  3, "four_star" :  4, "five_star" :  5,
    "one_stars" : 1, "two_stars" : 2, "three_stars" : 3, "four_stars" : 4, "five_stars" : 5
};

var setLastTweetSeen = function(clientName, tweetId) {
    dbConnection.getCollection(function(clients) {
        clients.update({
            "name" : clientName
        }, {
            $set : {
                "lastTweetSeen" : tweetId
            }
        }, function(err) {
            if (err) {
                throw err;
            }
        });
    });
};

var getLastTweetSeen = function(clientName, callback) {
    dbConnection.getCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            if (docs && docs.length) {
                callback(docs[0].lastTweetSeen);
            }
        });
    });
};

var submitReview = function(client, status, productId, rating) {
    var review = {
        "userid" : status.user.id_str,
        "usernickname" : "@" + status.user.screen_name,
        "productid" : productId,
        "rating" : rating,
        "reviewtext" : status.text
    };

    if (status.user.location) {
        review.location = status.user.location;
    }

    var photoUrlPrefix = "photourl_";
    var photoUrlCount = 1;

    if (status.user.profile_image_url) {
        // the avatar is always at photourl_1
        // remove _normal from the photo url because we want the original size
        review[photoUrlPrefix + photoUrlCount] = status.user.profile_image_url.replace("_normal.", ".");
        review.avatar = photoUrlPrefix + photoUrlCount;
    }

    if (status.entities.media) {
        var media = status.entities.media;

        // the avatar is always at photourl_1 and all other images are photourl_2+
        photoUrlCount++;

        for (var i = 0; i < media.length; i++) {
            review[photoUrlPrefix + photoUrlCount++] = media[i].media_url;
        }
    }

    bvsubmit.postReview(client, review);
};

var buildHashTagToProductIdMapping = function(clientDoc) {
    var hashTagsToProductIds = {};

    for (var i = 0; i < clientDoc.products.length; i++) {
        hashTagsToProductIds[clientDoc.products[i].hashTag.toLowerCase()] = clientDoc.products[i].externalId;
    }

    return hashTagsToProductIds;
};

var searchTwitterForReviews = function(client, hashTagsToProductIds) {
    var searchParams = {
        "include_entities" : true
    };

    if (client.lastTweetSeen) {
        searchParams.since_id = client.lastTweetSeen;
    }

    if (!clientNameToTwitter[client.name]) {
        clientNameToTwitter[client.name] = new twitter({
            "consumer_key": client.consumerKey,
            "consumer_secret": client.consumerSecret,
            "access_token_key": client.accessTokenKey,
            "access_token_secret": client.accessTokenSecret
        });
    }

    clientNameToTwitter[client.name].search("@" + client.twitterHandle + " +exclude:retweets", searchParams, function(results) {
        if (results && results.statuses) {
            console.log("found tweets.|client.name=" + client.name + "|results.statuses.length=" + results.statuses.length);

            var maxStatusId = 0;
            var status = null;
            var hashTags = null;
            var hashTag = null;
            var rating = 0;
            var productId = null;

            for (var i = 0; i < results.statuses.length; i++) {
                status = results.statuses[i];
                maxStatusId = Math.max(status.id, maxStatusId);
                hashTags = status.entities.hashtags;

                console.log("tweeview candidate|client.name=" + client.name + "|status.id_str" + status.id_str);

                if (hashTags) {
                    productId = null;
                    rating = 0;

                    for (var h = 0; h < hashTags.length && (!productId || !rating); h++) {
                        hashTag = hashTags[h].text.toLowerCase();
                        productId = productId || hashTagsToProductIds[hashTag];
                        rating = rating || hashTagToRating[hashTag];
                    }

                    if (productId && rating) {
                        console.log("found tweeview.|client.name=" + client.name +
                                                   "|productId=" + productId +
                                                   "|rating=" + rating +
                                                   "|status.user.screen_name=" + status.user.screen_name +
                                                   "|status.id_str=" + status.id_str +
                                                   "|status.text=" + status.text);
                        submitReview(client, status, productId, rating);
                    }
                }
            }

            setLastTweetSeen(client.name, maxStatusId);
        }
    });
};

var startTwitterPoller = function(clientName, searchInterval) {
    clientNameToInterval[clientName] = setInterval(function() {
        var currentDate = Date.now();

        dbConnection.getCollection(function(clientsCollection) {
            clientsCollection.findOne({
                "name" : clientName,
                "searchInterval" : { $gt : 0 },
                "products.start" : { $lte : currentDate },
                $or : [
                    { "products.end" : null },
                    { "products.end" : { $gt : currentDate } }
                ]
            }, function(err, clientDoc) {
                if (err) {
                    console.log("error while searching for client|clientName=" + clientName);
                    throw err;
                }

                if (clientDoc) {
                    searchTwitterForReviews(clientDoc, buildHashTagToProductIdMapping(clientDoc));
                } else {
                    console.log("failed to find client. do they have active campaigns?|clientName=" + clientName);
                }
            });
        });
    }, searchInterval);
};

var stopPollingForClient = function(clientName) {
    if (clientNameToInterval[clientName]) {
        clearInterval(clientNameToInterval[clientName]);
        delete clientNameToInterval[clientName];
    }

    if (clientNameToTwitter[clientName]) {
        delete clientNameToTwitter[clientName];
    }
};

var stopPollingForAllClients = function() {
    for (var clientName in clientNameToInterval) {
        stopPollingForClient(clientName);
    }
};

var startPollingForClient = function(clientName) {
    dbConnection.getCollection(function(clientsCollection) {
        // find the client by name, and also check whether they have Twitter
        // credentials, a valid search interval, and active campaigns
        clientsCollection.findOne({
            "name" : clientName,
            "consumerKey" : { $exists : true },
            "consumerSecret": { $exists : true },
            "accessTokenKey": { $exists : true },
            "accessTokenSecret": { $exists : true }
        }, function(err, clientDoc) {
            if (err) {
                console.log("error while searching for client|clientName=" + clientName);
                throw err;
            }

            if (clientDoc) {
                if (clientNameToInterval[clientName]) {
                    stopPollingForClient(clientName);
                }

                startTwitterPoller(clientName, clientDoc.searchInterval);
            } else {
                console.log("failed to find client. do they have Twitter credentials? is their search interval set?|clientName=" + clientName);
            }
        });
    });
};

var startPollingForAllClients = function() {
    dbConnection.getCollection(function(clientsCollection) {
        clientsCollection.find().each(function(err, clientDoc) {
            if (err) {
                console.log("error while retreiving all client docs.");
                throw err;
            }

            if (clientDoc) {
                console.log("starting Twitter poller|clientDoc.name=" + clientDoc.name);
                startPollingForClient(clientDoc.name);
            }
        });
    });
};

exports.startPollingForClient = startPollingForClient;
exports.startPollingForAllClients = startPollingForAllClients;
exports.stopPollingForClient = stopPollingForClient;
exports.stopPollingForAllClients = stopPollingForAllClients;