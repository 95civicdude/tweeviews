var dbConnection = require('../data/dbConnection.js');

exports.create = function(req, res) {
    dbConnection.getClientsCollection(function(clients) {
        var twitterHandle = req.body.twitterHandle;

        if (twitterHandle[0] === "@") {
            twitterHandle = twitterHandle.substr(1);
        }

        clients.update({
            "name" : req.body.name
        }, {
            $set : {
                "name" : req.body.name,
                "apiKey" : req.body.apiKey,
                "encodingKey" : req.body.encodingKey,
                "twitterHandle" : twitterHandle,
                "consumerKey": req.body.consumerKey,
                "consumerSecret": req.body.consumerSecret,
                "accessTokenKey": req.body.accessTokenKey,
                "accessTokenSecret": req.body.accessTokenSecret
            }
        }, {
            "upsert" : true
        }, function (err) {
            if (err) {
                throw err;
            }
        });
    });

    res.redirect("clients");
};

exports.display = function(req, res) {
    var clientNames = [];

    dbConnection.getClientsCollection(function(clients) {
        clients.find().each(function(err, client) {
            if (err) {
                throw err;
            }

            if (client) {
                console.log(client.name);
                // TODO this doesn't work!! it doesn't push anything to the
                // clientNames array...  :(
                clientNames.push(client.name);
            }
        });
    });

    res.render("clients", { "clientNames" : clientNames.length });
};