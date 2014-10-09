/*
 * client record schema:
   {
        "name" : "jeffs-testcompany",
        "apiKey" : "xxxxxxxx"
        "twitterHandle" : "tshacktoberfest",
        "consumerKey": "iOuQfKzgo3wuAZ7PPCvf12gtn",
        "consumerSecret": "Ci6xlaeFi8kOfbmr92DYLh7851lWrOUsfaUyrJ7YzWkVgYio25",
        "accessTokenKey": "2847594302-Z0AkMYFeV37RFvvGjQ1OCXoWoqgIMpKS1bFzjP8",
        "accessTokenSecret": "aIXo1fyhuXIIcha1NnGritbFyEL7JDH74mei7PcV5YRua",
        "products" : [
            {
                "externalId" : "566",
                "hashTag" : "vue"
            },
            {
                "externalId" : "vue",
                "hashTag" : "vue2"
            }
        ]
    }
 */

var dbConnection = require('../data/dbConnection.js');

exports.create = function(req, res) {
    dbConnection.getClientsCollection(function(clients) {
        clients.update({
            "name" : req.body.name
        }, {
            $set : {
                "name" : req.body.name,
                "apiKey" : req.body.apiKey,
                "twitterHandle" : req.body.twitterHandle,
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