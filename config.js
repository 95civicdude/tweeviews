// top-most parent
var config = {};

// parent object for data-level configurations
config.data = {};

/*********************
 data/dbConnection.js
 *********************/
config.data.dbConnection = {};
config.data.dbConnection.server = "hackathon.ts.bazaarvoice.com";
config.data.dbConnection.port = 27017;
config.data.dbConnection.database = "tweeviews";
config.data.dbConnection.collection = "clients";
// assumes mongo
config.data.dbConnection.url = "mongodb://" + config.data.dbConnection.server + ":" + config.data.dbConnection.port + "/" + config.data.dbConnection.database;

/**********************
 data/twitterPoller.js
 **********************/
config.data.twitterPoller = {};
config.data.twitterPoller.pollingInterval = 300000; // in millisenconds

exports.config = config;