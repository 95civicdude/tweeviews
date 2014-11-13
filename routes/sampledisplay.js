var dbConnection = require("../data/dbConnection.js");

exports.display = function(req, res) {
	console.log("here1");
	getClientApiKey(
		req.param("clientName"), 
		function(apiKey){
			console.log("testtt");
			console.log("test" + apiKey);
			res.render("sampledisplay", {clientName: req.param("clientName"), hashTag: req.param("hashTag"), apiKey: apiKey});
		});
};


var getClientApiKey = function(clientName, callback) {
	console.log("here2");
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
        });
    });
};