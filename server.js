
app = module.exports = function (port){

	var express = require('express')
	  , http 	= require('http')
	  , fs 		= require('fs')
	  , path 	= require('path');

	var app = express();
	var router = express.Router();

	app.set('port', port);

	app.use(router);

	app.use('/', express.static(path.resolve( './')));

	router.use(function(req, res, next) {
	  next();
	});

	app.use(function(req, res, next) {
		debug = (req.query.debug && req.query.debug == 'api');
		next();

	})

	// Api
	router.route('/api/user/current').get(function(req, res){
			var json = {"status":"success","data":{username: 'Hello world'}}
			res.json(json);

	});

	router.route('/api/*').all(function(req, res){
		// if (debug){
			res.send("Hello Api! I'm Node server");
		// }
	});

	// VIEWS

	var views = path.resolve( './dist/');

	;

	app.get("*", function(req, res){

		var template;
		if(req.path == '/'){
			template = '';
		}else{
			template = req.path.replace('/','');
		}

		template = views + '/' + template + '/'  + 'index.html';

		fs.stat(template, function(err, stat) {
			if (err == null) {
				res.sendFile(template)
			}else{

				var exts = ['jpg','png', 'gif']
				var ext = req.path.split('.').pop()

				if(exts.indexOf(ext) >= 0){
					res.sendFile(views + req.path)
				}else{
					res.send(template + " not found");
				}

			}
		});
	});


	http.createServer(app).listen(port, function(){
		console.log('\r\n' + 'Express server listening on port ' + port + '\r\n');
	})

	return app;

}
