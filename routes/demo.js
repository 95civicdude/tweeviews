var dbConnection = require("../data/dbConnection.js");

exports.display = function(req, res) {
    getClientData(
        req.param("clientName"), 
        function(clientData) {
            console.log(clientData);
            if(!clientData){
                res.render("demo", {error: "not_provisioned"});
            }
            else{
                // TODO: pass list of all clients getClientList
                getlick 
                res.render("demo", {productId: req.param("productId"), clientData: clientData, clientName: clientData.name, apiKey: clientData.apiKey, encodingKey: clientData.encodingKey, twitterHandle: clientData.twitterHandle, consumerKey: clientData.consumerKey, consumerSecret: clientData.consumerSecret, accessTokenKey: clientData.accessTokenKey, accessTokenSecret: clientData.accessTokenSecret, products: clientData.products});
            }
        }
    );

    

    // getClientList(
    //     function(clientList) {
    //         console.log(clientList[0].name);
    //         if(!clientList){
    //             res.render("demo", {error2: "no_clients"});
    //         }
    //         else{
    //             res.render("demo", {clientList: clientList});
    //         }
    // });
};


var getClientApiKey = function(clientName, callback) {
    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, docs) {
            if (err) {
                throw err;
            }

            if (docs && docs.length) {
                callback(docs[0].apiKey);
            }
            else {callback(null);}
        });
    });
};

var getClientList = function(callback) {
    dbConnection.getClientsCollection(function(clients) {
        // TODO: place all client names in an array to callback
        clients.find().toArray(function(err, clientList) {
            if (err) {
                throw err;
            }

            if (clientList && clientList.length) {
                callback(clientList);
            }
            else {callback(null);} 
        });
    });
    
};

var getClientData = function(clientName, callback) {
    dbConnection.getClientsCollection(function(clients) {
        clients.find({
            "name" : clientName
        }).toArray(function(err, clientData) {
            if (err) {
                throw err;
            }

            if (clientData && clientData.length) {
                callback(clientData[0]);
            }
            else {callback(null);}
        });
    });
    
};