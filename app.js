
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
var bookProvider = new BookProvider('localhost', 27017);
var Yes24 = require('./models/yes24').Yes24;
var yes24 = new Yes24();
var crypto = require('crypto');

var adminPw = 'dndbtqlcRkfdjaxorb';

app.configure(function(){
  app.set('port', process.env.PORT || 2046);
  app.set('views', __dirname + '/view');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
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
		bookProvider.findByISBN(req.params.id, function(err, book){
			if(err || !book ){
				res.render('result.jade', {'state':'error', 'go':'/', 'message':'해당하는 도서를 찾을 수 없습니다!'});
			}else{
				res.render('detail.jade', {'book':book});
			}
		});
});
app.get('/request', function(req, res){
		res.render('request.jade');
});
app.get('/request/:goodsno', function(req, res){
	yes24.getDetail(req.params.goodsno, function(err, book){
		
		res.render('request_form.jade', {
			'goods_no':req.params.goodsno, 
			'book':book.Product_Public.Product[0], 
			'intro':book.Product_Public.ProductContentsSimpleInfo[0].Intro[0], 
			'authorInfo':book.Product_Public.ProductContentsSimpleInfo[0].AuthIntro[0]
		});
	});
});

app.get(/^\/admin\/?(.*)/, function(req, res){
	var hash = crypto.createHash('md5');
	hash.update(adminPw);
	if( !req.cookies.admin_verify || req.cookies.admin_verify != hash.digest('hex') ){
		res.render('admin/admin_login.jade', {go:req.path});
	}else{
		res.render(req.path.substr(1));
	}
});

app.post('/admin', function(req, res){
	var hash = crypto.createHash('md5');
	var in_hash = crypto.createHash('md5');
	hash.update(adminPw);
	in_hash.update(req.body.pw);
	var dig = in_hash.digest('hex');
	if( dig != hash.digest('hex') ){
		res.render('result.jade', {'state':'error', 'go':'/admin', 'message':'암호가 틀렸습니다.'});
	}else{
		res.cookie('admin_verify', dig);
		if( req.body.go ){
			res.redirect(req.body.go);
		}else{
			res.redirect('/admin');
		}
	}
});

app.post('/request', function(req, res){
	console.dir(req.body);
	var book = req.body;
	book.state = 2;
	book.requestDate = (new Date()).getTime();
	bookProvider.findByISBN(book.ISBN, function(err, result){
		if( result ){
			// 이미 있는 책이다!
			res.render('result.jade', {state:'error', message:'이미 소장중이거나 구매 요청된 도서입니다.', go:'/request'});
		}else{
			// 오케잉! 저장하자!
			bookProvider.save(book, function(err, books){
				res.render('result.jade', {state:'success', message:'구매 요청이 완료되었습니다.', go:'/detail/' + books[0].ISBN});
			});
		}
	});
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
		default:
			next();
		break;
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
