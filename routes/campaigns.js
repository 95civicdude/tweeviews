var dbConnection = require('../data/dbConnection.js');

exports.addOrUpdate = function(req, res) {
    var clientName = req.body.clientName;
    var productExternalId = req.body.productExternalId;
    var productHashTag = req.body.productHashTag;
    var campaignStart = req.body.campaignStart;
    var campaignEnd = req.body.campaignEnd;

    if ("#" !== productHashTag[0]) {
        productHashTag = "#" + productHashTag;
    }

    if (campaignStart) {
        campaignStart = new Date(campaignStart).getTime();
    } else {
        campaignStart = Date.now();
    }

    if (campaignEnd) {
        campaignEnd = new Date(campaignEnd).getTime();
    } else {
        campaignEnd = null;
    }

    dbConnection.getCollection(function(clients) {
        clients.update({
            "name" : clientName,
            "products.externalId" : productExternalId
        }, {
            $set : {
                "products.$.hashTag" : productHashTag,
                "products.$.start" : campaignStart,
                "products.$.end" : campaignEnd
            }
        }, function (err, result) {
            if (err) {
                throw err;
            }

            if (result) {
                console.log("updated campaign|result=" + result +
                                            "|clientName=" + clientName +
                                            "|productExternalId=" + productExternalId +
                                            "|productHashTag=" + productHashTag +
                                            "|campaignStart=" + campaignStart +
                                            "|campaignEnd=" + campaignEnd);
                res.redirect("campaigns");
            } else {
                clients.update({
                    "name" : clientName
                }, {
                    $push : {
                        "products" : {
                            "externalId" : productExternalId,
                            "hashTag" : productHashTag,
                            "start" : campaignStart,
                            "end" : campaignEnd
                        }
                    }
                }, function(err) {
                    if (err) {
                        throw err;
                    }

                    if (result) {
                        console.log("added new campaign|clientName=" + clientName +
                                                      "|productExternalId=" + productExternalId +
                                                      "|productHashTag=" + productHashTag +
                                                      "|campaignStart=" + campaignStart +
                                                      "|campaignEnd=" + campaignEnd);
                    } else {
                        console.log("failed to update client's campaigns|clientName=" + clientName);
                    }
                    res.redirect("campaigns");
                });
            }
        });
    });
};

exports.end = function(req, res) {
    var campaignEnd = Date.now();
    var clientName = req.body.clientName;
    var productExternalId = req.body.productExternalId;

    dbConnection.getCollection(function(clients) {
        clients.update({
            "name" : clientName,
            "products.externalId" : productExternalId
        }, {
            $set : {
                "products.$.end" : campaignEnd
            }
        }, function(err, result) {
            if (err) {
                console.log("failed to end campaign|clientName=" + clientName +
                                                  "|productExternalId=" + productExternalId +
                                                  "|campaignEnd=" + campaignEnd);
                throw err;
            }

            console.log("ended campaign|result=" + result +
                                      "|clientName=" + clientName +
                                      "|productExternalId=" + productExternalId +
                                      "|campaignEnd=" + campaignEnd);
            res.redirect("campaigns");
        });
    });
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

exports.display = function(req, res) {
    res.render("campaigns");
};