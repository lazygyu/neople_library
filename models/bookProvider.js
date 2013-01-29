var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require ('mongodb').Server;
var BSON = require ('mongodb').BSON;
var ObjectID = require ('mongodb').ObjectID;



var bookCounter = 1;
BookProvider = function(host, port){
	this.db = new Db('neople_library', new Server(host, port, {auto_reconnect: true}), {safe:false});
    this.db.open(function(error){
      if (!error){
		console.log ("mongodb connected");
      }else {
		console.log (error);
      }
    });
}

BookProvider.prototype.getCollection = function(cb){
	this.db.collection('books', function(error, book_collection){
		if( error ) cb(error);
		else cb(null, book_collection);
	});
}

BookProvider.prototype.findAll = function(cb){
	this.getCollection(function(err, books){
		if( err ) cb(err);
		else {
			books.find().toArray(function(error, results){
				if( error ) cb(error);
				else cb(null, results);
			});
		}
	});
}

BookProvider.prototype.findById = function(id, cb){
	var result = null;
	for(var i=0;i<this.dummyData.length;i++){
		if( this.dummyData[i]._id == id){
			console.log("Found book for id " + id);
			result = this.dummyData[i];
			console.log(result);
			break;
		}
	}
	cb(null, result);
}

BookProvider.prototype.findByISBN = function(isbn, cb){
	this.getCollection(function(err, books){
		if( err ) cb(err);
		else{
			books.findOne({'ISBN':isbn}, function(err, result){
				if(err) cb(err);
				else cb(null, result);
			});
		}
	});
}

BookProvider.prototype.save = function(book, cb){
	this.getCollection(function(err, books){
		if( err ) cb(err);
		else{
			if( typeof(book.length) == "undefined" ){
				book = [ book ];
			}

			var bk = null;

			for(var i=0,l=book.length; i<l; i++){
				bk = book[i];
				bk.created_at = new Date();
				
				if( bk.buyDate == undefined )
					bk.buyDate = null;
				

				if( bk.rentHistory == undefined )
					bk.rentHistory = [];
			}

			books.insert(book, function(){
				cb(null, book);
			});
		}
	});
}

BookProvider.prototype.rent = function(isbn, rent , cb){
	this.getCollection(function(err, books){
		if(err) cb(err);
		else{
			books.findOne({'ISBN':isbn}, function(err, result){
				if(err) cb(err);
				else{
					result.rentHistory.push(rent);
					result.state = 1;
					books.save(result);
				}
			});
		}
	});
}

BookProvider.prototype.changeState = function(isbn, state, cb){
	this.getCollection(function(err, books){
		if(err) cb(err);
		else{
			books.findOne({'ISBN':isbn}, function(err, result){
				if(err) cb(err);
				else{
					result.state = state;
					books.save(result, function(err, res){
						cb(res);
					});
				}
			});
		}
	});
}


BookProvider.prototype.getList = function(opt, cb){
	var bk = null;
	var page = 0;
	var method = 'list';
	var keyword = '';
	var sort = '';
	var countPerPage = 25;

	var query = {};
	
	if( opt.page ) pages = opt.page;
	if( opt.method ) method = opt.method;
	if( opt.countPerPage ) countPerPage = opt.countPerPage;

	if( opt.keyword ) query.title = {$regex : opt.keyword, $options:'i'};
	if( opt.sort ){
		var tsort = opt.sort.split('|');
		var tmpsort = {};
		if(typeof(tsort[1]) == "undefined") tsort[1] = 1;
		tmpsort[tsort[0]] = tsort[1];
		query.$orderby = tmpsort;
	}
	if( typeof(opt.state) != "undefined" ) query.state = parseInt(opt.state, 10);
	//query.$skip = (page * countPerPage);
	//query.$limit = countPerPage;

	console.dir(query);
	
	this.getCollection(function(err, books){
		if(err) cb(err);
		else{
			books.find(query).limit(countPerPage).skip(countPerPage * page).toArray(function(err, results){
				if( err ) cb(err);
				else{
					console.dir(results);
					cb(null, results);
				}
			});
		}
	});
}

BookProvider.prototype.getCount = function(opt, cb){

}

BookProvider.prototype.getCount = function(opt, cb){
	cb(null, bookCounter);
}
//
//new BookProvider().save([
//		{title:'자바스크립트 웹 애플리케이션 JavaScript Web Applications', author:'알렉스 맥카우 저 / 우정은 역', thumb:'http://image.yes24.com/goods/7105212', state:0}
//		, {title:'test_book2', author:'tester', thumb:'/images/test.png', state:1, rentHistory:[{name:'엄태규', startDate:new Date(2013, 0, 27).getTime(), endDate:new Date(2013, 0, 31).getTime()}]}
//		, {title:'프로그래머가 알아야 할 97가지', author:'<Kevlin Henney> 편/<손영수>,<김수현>,<최현미> 공역', thumb:'http://image.yes24.com/goods/7130112', state:0, rentHistory:[{name:'이한준', startDate:new Date(2013, 0, 20).getTime(), endDate:new Date(2013, 0, 25).getTime()}]}
//		], function(error, books){});

exports.BookProvider = BookProvider;
