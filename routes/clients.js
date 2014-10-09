exports.create = function(req, res) {
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect("mongodb://localhost:27017/tweeviews", function(err, db) {
        var collection = db.collection("clients");

        collection.insert({
            "name" : req.body.name,
            "apiKey" : req.body.apiKey,
            "twitterHandle" : req.body.twitterHandle,
            "consumerKey": req.body.consumerKey,
            "consumerSecret": req.body.consumerSecret,
            "accessTokenKey": req.body.accessTokenKey,
            "accessTokenSecret": req.body.accessTokenSecret
        }, function(err, result) {
            if (err) {
            throw err;
            }

            db.close();
        });
    });

    res.redirect("clients");
};

exports.display = function(req, res) {
    var clientNames = [];
    var MongoClient = require("mongodb").MongoClient;

    MongoClient.connect("mongodb://localhost:27017/tweeviews", function(err, db) {
        db.collection("clients").find()
            .each(function(err, client) {
                if (err) {
                    throw err;
                }

                if (!client) {
                    db.close();
                } else {
                    console.log(client.name);
                    // TODO this doesn't work!! it doesn't push anything to the
                    // clientNames array...  :(
                    clientNames.push(client.name);
                }
            });
    });

    res.render("clients", { "clientNames" : clientNames.length });
};