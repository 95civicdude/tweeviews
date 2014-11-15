// parent objects
var data = {};
var routes = {};


/********************
 data/dbConnection.js
 ********************/
data.dbConnection = {
    "server" : "hackathon.ts.bazaarvoice.com",
    "port" : 27017,
    "database" : "tweeviews",
    "collection" : "clients"
};
// assumes mongo
data.dbConnection.url = "mongodb://" + data.dbConnection.server + ":" + data.dbConnection.port + "/" + data.dbConnection.database;


/*****************
 routes/clients.js
 *****************/
routes.clients = {
    "defaultSearchInterval" : 600000
};


exports.data = data;
exports.routes = routes;