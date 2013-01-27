
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var BookProvider = require('./models/bookProvider').BookProvider;
var bookProvider = new BookProvider();
var Yes24 = require('./models/yes24').Yes24;
var yes24 = new Yes24();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/view');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname+'/bootstrap'));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
		res.render('main.jade');
});

app.get('/list', function(req, res){
		res.render('list.jade');
});

app.get('/detail/:id', function(req, res){
		bookProvider.findById(req.params.id, function(err, book){
			
			res.render('detail.jade', {'book':book});
		});
});
app.get('/request', function(req, res){
		res.render('request.jade');
});

app.get(/^\/api\/([^\/]+)\/?(.*)/, function(req, res){
	switch(req.params[0]){
		case 'list':
			if( req.params[1].length > 0 ){
				var params = req.params[1].split('/');
				if(params.length == 0){
					bookProvider.findAll(function(err, books){
						res.send(books);
					});
				}else{
					var setting = {};
					for(var i=0,l=params.length;i<l;i+=2){
						if(i % 2 == 0){
							setting[params[i]] = params[i+1];
						}
					}
					bookProvider.getList(setting, function(err, books){
						res.send(books);
					});
				}
			}else{
				bookProvider.findAll(function(err, books){
					res.send(books);
				});
			}
		break;
		case 'y24':
			var params = req.params[1].split('/');
			yes24.search(params[0], function(err, lists, headers){
				res.send(lists);		
			});
		break;
		default:
			next();
		break;
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
