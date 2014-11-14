
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var campaigns = require('./routes/campaigns');
var clients = require('./routes/clients');
var sampledisplay = require('./routes/sampledisplay');
var demo = require('./routes/demo');
var docs = require('./routes/docs');
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
app.get('/demo', demo.display);
app.get('/demo/:clientName', demo.display);
app.get('/demo/:clientName/:productId', demo.display);
app.get('/display', routes.display);
app.get('/clients', clients.display);
app.get('/campaigns', campaigns.display);
app.get('/docs', docs.display);
app.get('/sampledisplay/:clientName/:hashTag', sampledisplay.display);

// GET /p/5
// tagID is set to 5

app.post('/clients/create', clients.create);
app.post('/campaigns/addOrUpdate', campaigns.addOrUpdate);
app.post('/campaigns/end', campaigns.end);
app.post('/campaigns/list', campaigns.list);

process.on('SIGINT', function() {
  process.exit();
});
process.on('exit', function() {
    var dbConnection = require('./data/dbConnection.js');

    console.log("closing db connection...");
    dbConnection.closeDbConnection();
});

console.log("starting Twitter poller...");
require('./data/twitterPoller.js').start();

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
