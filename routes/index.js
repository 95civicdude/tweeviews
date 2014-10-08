
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

// $(".BVTweeviews").tweeviews('m6alb4h78ttx8d9rznzmxsqw1', { staging: true });

// jeffs-testcompany	m6alb4h78ttx8d9rznzmxsqw1	Conversations API (stg)	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	hjly6y9tg13swpa22oi87p3of	Conversations API	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	wwbue7fuyu8t77due7nbmsa3	Conversations API	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	wjzxtmj4waq4h83f3fquj7ta	Conversations API (stg)	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	inej50c97cuws3z5qk37sw64u	Conversations API (stg)	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	26ia2jv2z6b3knbe95dy3kimb	Conversations API	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	3u8j6tfhn55r356yrvhc76vb	Conversations API	BV Internal / Unknown	BV Internal / Unknown	 Enabled  Disable
// jeffs-testcompany	2ywgt9rp36zdvdm3afsfdsst	Conversations API (stg)	BV Internal / Unknown	BV Internal / Unknown