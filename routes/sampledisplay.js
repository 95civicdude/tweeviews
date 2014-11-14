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