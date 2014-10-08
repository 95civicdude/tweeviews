
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
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
app.post('/createCampaign', function(req, res) {
    var MongoClient = require('mongodb').MongoClient;

    // Use connect method to connect to the Server
    MongoClient.connect('mongodb://localhost:27017/tweeviews', function(err, db) {
      var collection = db.collection('clients');

      collection.update({ 'client' : 'jeffs-testcompany' }, {
        $addToSet : { "products" : {
            "external_id" : req.body.productid,
            "hash_tag" : req.body.producthash
        }}
      }, function(err, result) {
        if (err != null) {
            console.log(err);
        }
      });

      db.close();
    });

    res.render('display', {});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
