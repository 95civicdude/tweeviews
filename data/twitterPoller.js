var dbConnection = require("./dbConnection.js");
var twitter = require("twitter");
var starRatingRegex = /([1-5])stars?/gi;

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
        }, function(err, client) {
            if (err) {
                throw err;
            }

            if (client) {
                callback(client.lastTweetSeen);
            }
        });
    });
};

var startSearchPoll = function(client) {
    var t = new twitter({
        "consumer_key": client.consumerKey,
        "consumer_secret": client.consumerSecret,
        "access_token_key": client.accessTokenKey,
        "access_token_secret": client.accessTokenSecret
    });

    if (client.products && client.products.length) {
        var params = {
            "count" : 10,
            "since_id" : undefined,
            "max_id" : undefined
        };

        getLastTweetSeen(client.name, function(lastTweetSeen) {
            if (lastTweetSeen) {
                params.defineProperty("since_id", String(lastTweetSeen));
            }
        });

        var hashTagRegexp = null;
        var hashTagRegexpString = "(" + client.products[0].hashTag;

        for (var i = 1; i < client.products.length; i++) {
            hashTagRegexpString += "|" + client.products[i].hashTag;
        }

        hashTagRegexpString += ")";
        console.log("hashTagRegexpString=" + hashTagRegexpString);
        hashTagRegexp = new RegExp(hashTagRegexpString, "gi");

        setInterval(function() {
            t.getMentions(params, function(statuses) {
                console.log("statuses.length=" + statuses.length);

                if (statuses && statuses.length) {
                    var rating = null;
                    var productHashTag = null;

                    for (var i = 0; i < statuses.length; i++) {
                        params.since_id = String(Math.max(Number(params.since_id), Number(statuses[i].id)));
                        statusText = statuses[i].text;
                        rating = starRatingRegex.exec(statusText);
                        productHashTag = hashTagRegexp.exec(statusText);

                        if (rating && productHashTag) {
                            rating = rating[1];
                            productHashTag = productHashTag[1];
                        }

                        max_id = String(Math.min(Number(max_id), Number(statuses[i].id)));
                    }

                    if (max_id) {
                        params.defineProperty("max_id", max_id);
                    }

                    setLastTweetSeen(client.name, since_id);
                }
            });
        }, 3500);
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