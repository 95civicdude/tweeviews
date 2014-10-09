var mongoClient = require('mongodb').MongoClient;
var dbConnection = null;
var clientsCollection = null;

var closeDbConnection = function() {
  if (dbConnection) {
      console.log("closing db connection...");
      dbConnection.close();
  }
};

var getDbConnection = function(callback) {
    if (dbConnection) {
        callback(dbConnection);
    } else {
        mongoClient.connect("mongodb://localhost:27017/tweeviews", function(err, db) {
            if (err) {
              throw err;
            }

            dbConnection = db;
            callback(dbConnection);
        });
    }
};

var getClientsCollection = function(callback) {
    if (clientsCollection) {
        callback(clientsCollection);
    } else {
        getDbConnection(function(db) {
            db.collection("clients", function (err, coll) {
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
exports.getClientsCollection = getClientsCollection;