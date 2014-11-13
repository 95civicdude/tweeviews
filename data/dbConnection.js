var mongoClient = require("mongodb").MongoClient;
var config = require("../config.js").data.dbConnection;

var dbConnection = null;
var clientsCollection = null;

var closeDbConnection = function() {
  if (dbConnection) {
      dbConnection.close();
      console.log("db connection closed.");
  }
};

var getDbConnection = function(callback) {
    if (dbConnection) {
        callback(dbConnection);
    } else {
        mongoClient.connect(config.url, function(err, db) {
            if (err) {
              throw err;
            }

            console.log("connected to db|url=" + config.url);
            dbConnection = db;
            callback(dbConnection);
        });
    }
};

var getCollection = function(callback) {
    if (clientsCollection) {
        callback(clientsCollection);
    } else {
        getDbConnection(function(db) {
            db.collection(config.collection, function (err, coll) {
                if (err) {
                  throw err;
                }

                clientsCollection = coll;
                callback(clientsCollection);
            });
        });
    }
};

exports.closeDbConnection = closeDbConnection;
exports.getDbConnection = getDbConnection;
// deprecated. use getCollection instead of getClientsCollection
exports.getClientsCollection = getCollection;
exports.getCollection = getCollection;