var http = require('http');
var xml2js = require('xml2js');
var util = require('util');
var parser = new xml2js.Parser({charkey:'value'});

function Yes24(){
}

Yes24.prototype.getDetail = function(goods_no, cb){
	var url = '/OpenAPI/PublicAPI.svc/GetProductDetail?productNo='+goods_no;
	http.get({hostname:'api.yes24.com', path:url}, function(res){
		var body = "";
		res.on("data", function(chunk){
			body += chunk;
		});

		res.on("end", function(){
			body = body.replace('\r\n', '');
			parser.parseString(body, function(err, result){
				cb(null, result);
			});
		});
	}).on('error', function(e){
		console.log("Got error : " + e.message);
	});
}

exports.Yes24 = Yes24;