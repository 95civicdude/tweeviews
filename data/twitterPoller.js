var dbConnection = require("./dbConnection.js");
var twitter = require("twitter");

var startSearchPoll = function(client) {
    var t = new twitter({
        "consumer_key": client.consumerKey,
        "consumer_secret": client.consumerSecret,
        "access_token_key": client.accessTokenKey,
        "access_token_secret": client.accessTokenSecret
    });
    var searchString = "@" + client.twitterHandle + " AND (";

    if (client.products && client.products.length) {
        searchString += client.products[0].hashTag;

        for (var i = 1; i < client.products.length; i++) {
            searchString += " OR " + client.products[i].hashTag;
        }

        searchString += ")";

        console.log("searchString=" + searchString);

        setInterval(function() {
            t.search(searchString, function(data) {
                if (data.statuses && data.statuses.length) {
                    console.log(JSON.stringify(data, null, "   "));
                }
                console.log(JSON.stringify(data, null, "   "));
            });
        }, 5000);
    }
}

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