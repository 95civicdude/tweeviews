var dbConnection = require("../data/dbConnection.js");

exports.display = function(req, res) {
	getClientApiKey(
		req.param("clientName"), 
		function(apiKey){
			if(!apiKey){
				res.render("sampledisplay", {error: "not_provisioned"});
            }
			else{
                res.render("sampledisplay", {clientName: req.param("clientName"), hashTag: req.param("hashTag"), apiKey: apiKey});
            }
		});
    // getClientList(
    //     function(clientList) {
    //         console.log(clientList);
    //         if(!apiKey){
    //             res.render("sampledisplay", {error2: "no_clients"});
    //         }
    //         else{
    //             res.render("sampledisplay", {clientList: clientList});
    //         }
    //     }
    // )
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
    // dbConnection.getClientsCollection(function(clients) {
    //     // TODO: place all client names in an array to callback
    //     clients.find({
    //         "name" : clientName
    //     }).toArray(function(err, docs) {
    //         if (err) {
    //             throw err;
    //         }

    //         if (docs && docs.length) {
    //             callback(docs);
    //         }
    //         else {callback(null);} 
    //     });
    // });
    
};