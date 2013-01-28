var bookCounter = 1;
BookProvider = function(){
}

BookProvider.prototype.dummyData = [];

BookProvider.prototype.findAll = function(cb){
	cb(null, this.dummyData);
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
	var result = null;
	for(var i=0;i<this.dummyData.length;i++){
		if( this.dummyData[i].ISBN == isbn ){
			result = this.dummyData[i];
			break;
		}
	}
	cb(null, result);
}

BookProvider.prototype.save = function(book, cb){
	var bk = null;
	if( typeof(book.length) == "undefined" ){
		book = [book];
	}

	for(var i=0;i<book.length;i++){
		bk = book[i];
		bk._id = bookCounter++;
		bk.created_at = new Date();
		if( bk.comments == undefined ){
			bk.comments = [];
		}
		
		if( bk.rentHistory == undefined ){
			bk.rentHistory = [];
		}

		this.dummyData[this.dummyData.length] = bk;
		
	}
	cb(null, book);
}


BookProvider.prototype.getList = function(opt, cb){
	var bk = null;
	var page = 0;
	var method = 'list';
	var keyword = '';
	var sort = '';
	var countPerPage = 25;
	if( opt.page ) pages = opt.page;
	if( opt.sort ) sort = opt.sort;
	if( opt.method ) method = opt.method;
	if( opt.keyword ) keyword = opt.keyword;
	if( opt.countPerPage ) countPerPage = opt.countPerPage;

	var results = [];
	for(var i=page * countPerPage,l=(page + 1) * countPerPage;i<l;i++){
		var book = this.dummyData[i];
		if( !book ) continue;
		if(keyword){
			if( book.title.toString().toUpperCase().indexOf(keyword.toUpperCase()) > -1 ){
				results.push(book);
			}else if(book.author.toString().toUpperCase().indexOf(keyword.toUpperCase()) > -1 ){
				results.push(book);
			}
		}else{
			results.push(book);
		}
	}
	cb(null, results);
}

BookProvider.prototype.getCount = function(opt, cb){
	cb(null, bookCounter);
}

new BookProvider().save([
		{title:'자바스크립트 웹 애플리케이션 JavaScript Web Applications', author:'알렉스 맥카우 저 / 우정은 역', thumb:'http://image.yes24.com/goods/7105212', state:0}
		, {title:'test_book2', author:'tester', thumb:'/images/test.png', state:1, rentHistory:[{name:'엄태규', startDate:new Date(2013, 0, 27).getTime(), endDate:new Date(2013, 0, 31).getTime()}]}
		, {title:'프로그래머가 알아야 할 97가지', author:'<Kevlin Henney> 편/<손영수>,<김수현>,<최현미> 공역', thumb:'http://image.yes24.com/goods/7130112', state:0, rentHistory:[{name:'이한준', startDate:new Date(2013, 0, 20).getTime(), endDate:new Date(2013, 0, 25).getTime()}]}
		], function(error, books){});

exports.BookProvider = BookProvider;
