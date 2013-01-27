var tojson = require('../modules/xml2json.js');
var http = require('http');
var Iconv = require('iconv').Iconv;
var iconv = new Iconv('windows-1252', 'UTF-8//IGNORE');
var Buffer = require('buffer').Buffer;
function Yes24(){
};

Yes24.prototype.search = function(key, cb){
	console.log(escape(key));
	//var url = '/OpenAPI/PublicAPI.svc/GetSearchList?keyword=' + key + '&currentPageIndex=0&pageSize=25&productType=1&domain=yes24.com';
	var url = '/SearchCorner/Sniper/GetSniperSearchJsonp?Query=' + escape(key) + '&Parsing=false&Domain=0&Page=1&PageSize=20';
	//authKey={authKey}&amp;domain={domain}&amp;keyword={keyword}&amp;conditionType={conditionType}&amp;currentPageIndex={currentPageIndex}&amp;pageSize={pageSize}&amp;productType={productType}&amp;sort={sort}
	http.get({host:'www.yes24.com', path:url, port:80, headers:{'Accept-Charset':'utf-8;q=0.7', 'X-Requested-With':'XMLHttpRequest', 'Accept':'application/json, text/javascript','Accept-Language':'ko-KR,ko;q=0.8'}}, function(response){
			var body = "";
			response.addListener('data', function(chunk){
					body += chunk;
				});

			response.addListener('end', function(){
					//var jsonObj = xml2json.parser( body );
					console.log(require('jschardet').detect(body));
					console.log(require('jschardet').detect(escape("테스트")));
					body = iconv.convert(body);
					//console.log(response.headers);
					//var jsonObj = eval(body.toString());
					cb(null, body.toString(), response.headers);
				});
	});
}

exports.Yes24 = Yes24;
