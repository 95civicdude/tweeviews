var dbConnection = require('../data/dbConnection.js');
var twitterPoller = require('../data/twitterPoller.js');

exports.startStopCampaign = function(req, res) {
    var hashTag = req.body.hashTag;
    var flag = req.body.startStop;

    if (flag == "stop") {
        twitterPoller.removeHashTag(hashTag);
    } else {
        twitterPoller.addHashTag(hashTag);
    }

    res.render("campaigns");
};

exports.list = function(req, res) {
    var clientName = req.body.clientName;
    var hashTags = {};

    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            if (docs && docs.length) {
                var client = docs[0];

                if (client.products) {
                    for (var i=0; i<client.products.length; i++) {
                        hashTags[client.products[i].hashTag] = client.products[i].externalId;
                    }
                    res.render("campaigns", {"clientProducts": client.products, "apiKey": client.apiKey});       // Send back the list of hashtags for display
                }
            }
        })
    });
};

exports.create = function(req, res) {
    var clientName = req.body.clientName;
    var externalId = req.body.externalId;
    var hashTag = req.body.hashTag;

    if (hashTag[0] !== "#") {
        hashTag = "#" + hashTag;
    }

    dbConnection.getClientsCollection(function(clients) {
        clients.update({
            "name" : clientName
        }, {
            $pull : {
                "products" : {
                    "externalId" : externalId
                }
            }
        }, function (err) {
            if (err) {
                throw err;
            }

            clients.update({
                "name" : clientName
            }, {
                $push : {
                    "products" : {
                        "externalId" : externalId,
                        "hashTag" : hashTag
                    }
                }
            }, function (err) {
                if (err) {
                    throw err;
                }
            });
        });
    });

    res.redirect("campaigns");
};

exports.display = function(req, res) {
    res.render("campaigns");
};