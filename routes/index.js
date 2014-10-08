
/*
 * GET home page.
 */

exports.index = function(req, res){
  	res.render('index', { title: 'Express' });

  	var util = require('util'),
    	twitter = require('twitter');
	var twit = new twitter({
	    consumer_key: 'iOuQfKzgo3wuAZ7PPCvf12gtn',
	    consumer_secret: 'Ci6xlaeFi8kOfbmr92DYLh7851lWrOUsfaUyrJ7YzWkVgYio25',
	    access_token_key: '2847594302-Z0AkMYFeV37RFvvGjQ1OCXoWoqgIMpKS1bFzjP8',
	    access_token_secret: 'aIXo1fyhuXIIcha1NnGritbFyEL7JDH74mei7PcV5YRua'
	});
	
	twit.search('#liveBV', function(data) {
    console.log(util.inspect(data));
	});
};
