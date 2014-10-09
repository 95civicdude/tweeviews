var dbConnection = require('../data/dbConnection.js');

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