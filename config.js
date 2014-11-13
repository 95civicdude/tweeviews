// parent object for data-level configurations
var data = {};

/*********************
 data/dbConnection.js
 *********************/
data.dbConnection = {};
data.dbConnection.server = "hackathon.ts.bazaarvoice.com";
data.dbConnection.port = 27017;
data.dbConnection.database = "tweeviews";
data.dbConnection.collection = "clients";
// assumes mongo
data.dbConnection.url = "mongodb://" + data.dbConnection.server + ":" + data.dbConnection.port + "/" + data.dbConnection.database;

/**********************
 data/twitterPoller.js
 **********************/
data.twitterPoller = {};
data.twitterPoller.pollingInterval = 600000; // in millisenconds

exports.data = data;