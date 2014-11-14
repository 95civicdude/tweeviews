var dbConnection = require("../data/dbConnection.js");

exports.display = function(req, res) {
	getClientApiKey(
		req.param("clientName"), 
		function(apiKey){
			if(!apiKey){
				res.render("demo", {error: "not_provisioned"});
            }
			else{
                res.render("demo", {clientName: req.param("clientName"), productId: req.param("productId"), apiKey: apiKey});
            }
	});

    getClientList(
        function(clientList) {
            //console.log(clientList[0].name);
            if(!clientList){
                res.render("demo", {error2: "no_clients"});
            }
            else{
                res.render("demo", {clientList: clientList});
            }
    });
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
        clients.find().toArray(function(err, clientData) {
            if (err) {
                throw err;
            }

            if (clientData && clientData.length) {
                callback(clientData);
            }
            else {callback(null);} 
        });
    });
    
};