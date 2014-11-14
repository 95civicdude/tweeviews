// parent object for data-level configurations
var data = {};

/*********************
 data/dbConnection.js
 *********************/
data.dbConnection = {
    "server" : "hackathon.ts.bazaarvoice.com",
    "port" : 27017,
    "database" : "tweeviews",
    "collection" : "clients"
};
// assumes mongo
data.dbConnection.url = "mongodb://" + data.dbConnection.server + ":" + data.dbConnection.port + "/" + data.dbConnection.database;

/**********************
 data/twitterPoller.js
 **********************/
data.twitterPoller = {
    "pollingInterval" : 0 // in millisenconds
};

exports.data = data;