var dbConnection = require("./dbConnection.js");
var twitter = require("twitter");
var starRatingRegex = /#(([1-5]|one|two|three|four|five)stars?)[\s#]*/i;
var ratingStringToNumber = {
    "one" : 1,
    "two" : 2,
    "three" : 3,
    "four" : 4,
    "five" : 5
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
    console.log("getProductIds(" + clientName + ")");

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
                        productIds[client.products[i].hashTag] = client.products[i].externalId;
                    };

                    callback(productIds);
                }
            }
        });
    });
};

var buildProductHashTagRegexp = function(products) {
    var hashTagRegexp =  "(" + products[0].hashTag;

    for (var i = 1; i < products.length; i++) {
        hashTagRegexp += "|" + products[i].hashTag;
    }

    hashTagRegexp += ")";

    return new RegExp(hashTagRegexp, "i");
};

var convertRatinStringToNumber = function(rating) {
    if (isNaN(rating)) {
        rating = ratingStringToNumber[rating];
    }

    return String(rating);
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

    var bvsubmit = require('bvsubmit');

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
        var hashTagRegexp = buildProductHashTagRegexp(client.products);
        var statuses = null;
        var rating = null;
        var productHashTag = null;
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
                        statuses = results.statuses;

                        for (var i = 0; i < 1; i++) {
                            statusText = statuses[i].text;
                            productHashTag = hashTagRegexp.exec(statusText);
                            rating = starRatingRegex.exec(statusText);

                            if(productHashTag && rating) {
                                submitReview(client, statuses[i], productIds[productHashTag[1]], convertRatinStringToNumber(rating[2]));
                            }
                        }

                        // TODO uncomment!
                        // searchParams.since_id = sinceIdRegexp.exec(results.search_metadata.refresh_url)[1];
                        // setLastTweetSeen(client.name, searchParams.since_id);
                    }
                });
            });
        }, 60000);
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