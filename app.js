
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var campaigns = require('./routes/campaigns');
var clients = require('./routes/clients');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/display', routes.display);
app.get('/clients', clients.display);
app.get('/campaigns', campaigns.display);

app.post('/clients/create', clients.create);
app.post('/campaigns/create', campaigns.create);

// app.post('/createCampaign', function(req, res) {
//     var MongoClient = require('mongodb').MongoClient;

//     // Use connect method to connect to the Server
//     MongoClient.connect('mongodb://localhost:27017/tweeviews', function(err, db) {
//       var collection = db.collection('clients');

//       collection.update({ 'client' : 'jeffs-testcompany' }, {
//         $addToSet : { "products" : {
//             "external_id" : req.body.productid,
//             "hash_tag" : req.body.producthash
//         }}
//       }, function(err, result) {
//         if (err) {
//             throw err;
//         }
//         db.close();
//       });
//     });

//     res.render('display', {});
// });

process.on('SIGINT', function() {
  process.exit();
});
process.on('exit', function() {
    var dbConnection = require('./data/dbConnection.js');

    dbConnection.closeDbConnection();
});

require('./data/twitterPoller.js').start();

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
