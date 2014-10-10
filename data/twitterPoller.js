var dbConnection = require("./dbConnection.js");
var twitter = require("twitter");
var bvsubmit = require('bvsubmit');

var ratings = {
    "1star" : 1,
    "2star" : 2,
    "3star" : 3,
    "4star" : 4,
    "5star" : 5,
    "1stars" : 1,
    "2stars" : 2,
    "3stars" : 3,
    "4stars" : 4,
    "5stars" : 5,
    "onestar" : 1,
    "twostar" : 2,
    "threestar" : 3,
    "fourstar" : 4,
    "fivestar" : 5,
    "onestars" : 1,
    "twostars" : 2,
    "threestars" : 3,
    "fourstars" : 4,
    "fivetars" : 5,
};

var setLastTweetSeen = function(clientName, tweetId) {
    dbConnection.getClientsCollection(function(clients) {
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
    dbConnection.getClientsCollection(function(clients) {
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

var getProductIds = function(clientName, callback) {
    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            if (docs && docs.length) {
                var client = docs[0];

                if (client.products && client.products.length) {
                    var productIds = [];

                    for (var i = 0; i < client.products.length; i++) {
                        productIds[client.products[i].hashTag.substr(1)] = client.products[i].externalId;
                    };

                    callback(productIds);
                }
            }
        });
    });
};

var submitReview = function(client, status, productId, rating) {
    var review = {
        "userid" : String(status.user.id),
        "usernickname" : "@" + status.user.screen_name,
        "productid" : productId,
        "rating" : rating,
        "reviewtext" : status.text
    };

    if (status.user.location) {
        review.location = status.user.location;
    }

    if (status.user.profile_image_url) {
        review.thirdpartyphotourl_1 = status.user.profile_image_url;
    }

    bvsubmit.postReview(client,review);
};

var startSearchPoll = function(client) {
    if (client.consumerKey && client.consumerSecret && client.accessTokenKey && client.accessTokenSecret && client.products && client.products.length) {
        var t = new twitter({
            "consumer_key": client.consumerKey,
            "consumer_secret": client.consumerSecret,
            "access_token_key": client.accessTokenKey,
            "access_token_secret": client.accessTokenSecret
        });

        var sinceIdRegexp = /\?since_id=([0-9]+).+/;
        var rating = null;
        var review = null;
        var searchParams = {};

        getLastTweetSeen(client.name, function(lastTweetSeen) {
            if (lastTweetSeen) {
                searchParams.since_id = String(lastTweetSeen);
            }
        });

        setInterval(function() {
            getProductIds(client.name, function(productIds) {
                t.search("@" + client.twitterHandle, searchParams, function(results) {
                    if (results && results.statuses && results.statuses.length) {
                        var hashTags = null;
                        var productId = null;
                        var statuses = results.statuses;

                        console.log("new tweets: " + statuses.length);

                        for (var i = 0; i < statuses.length; i++) {
                            console.log(statuses[i].text);

                            if (statuses[i].entities && statuses[i].entities.hashtags) {
                                productId = null;
                                rating = 0;
                                hashTags = statuses[i].entities.hashtags;

                                for (var j = 0; j < hashTags.length && (!productId || !rating); j++) {
                                    productId = productId || productIds[hashTags[j].text];
                                    rating = rating || ratings[hashTags[j].text];
                                }

                                if (productId && rating) {
                                    console.log("found tweet for product|productId=" + productId + "|rating=" + rating);
                                    submitReview(client, statuses[i], productId, String(rating));
                                }
                            }
                        }

                        searchParams.since_id = sinceIdRegexp.exec(results.search_metadata.refresh_url)[1];
                        setLastTweetSeen(client.name, searchParams.since_id);
                    }
                });
            });
        }, 60000); // <---------- manipulate the poll interval here (milliseconds)
    }
};

var start = function() {
    dbConnection.getClientsCollection(function(clients) {
        clients.find().each(function(err, client) {
            if (err) {
                throw err;
            }

            if (client) {
                startSearchPoll(client);
            }
        });
    });
};

exports.start = start;