var dbConnection = require('../data/dbConnection.js');

exports.list = function(req, res) {
    var clientName = req.body.clientName;
    var hashTags = [];

    //console.log("clientName=" + clientName);

    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            //console.log("docs.length=" + docs.length);

            if (docs && docs.length) {
                var client = docs[0];

                //console.log("client.products=" + client.products);

                if (client.products) {
                    for (var i=0; i<client.products.length; i++) {
                        hashTags.push(client.products[i].hashTag);
                    }
                }
            }

            //console.log("hashTags.length=" + hashTags.length);
            res.render("campaigns", {"hashTags" : hashTags});       // Send back the list of hashtags for display
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