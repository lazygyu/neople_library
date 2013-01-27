function makeEl(item){
	var li = $("<li class='media well' />");
	li.append("<a class='pull-left'><img class='media-object img-polaroid' src='http://image.yes24.com/goods/" + item.GOODS_NO + "'></a>");
	var strbody = "<div class='media-body'><h5 class='media-heading'>";
	if( item.SUB_TTL) strbody += "<small>" + item.SUB_TTL + "</small>";
	strbody += item.GOODS_NM;
	if( item.COMPANY2 ) strbody += "<span class='label' style='margin-left:1em;'>" + item.COMPANY2.split('`')[0] + "</span>";
	if( item.SERIES_INFO ) strbody += "<span class='label label-info' style='margin-left:1em;'>" + item.SERIES_INFO + "</span>";
	strbody += "</h5>";
	if( item.AUTH_INFO ) strbody += "<div><small>" + item.AUTH_INFO.split('`')[0].replace(/</g, "&lt;") + "</small></div>";
	strbody += "</div>";
	li.append(strbody);
	return li;
}
function encodeHTML(str){
 var aStr = str.split(''),
     i = aStr.length,
     aRet = [];

   while (--i) {
    var iC = aStr[i].charCodeAt();
    if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
      aRet.push('&#'+iC+';');
    } else {
      aRet.push(aStr[i]);
    }
  }
 return aRet.reverse().join('');
}

function requestCallback(dat){
	for(var i=0;i<dat.Count;i++){
		$("#search_results").append(makeEl(dat.List[i]));
	}
	if( dat.Count == 0 || !dat ){
		$("#search_results").append("<li class='media well'><div class='media-body'>검색 결과 없음</div></li>");
	}
}
$(function(){
		$("#search_title").keydown(function(e){
			if( e.which == 13 ){
				$("#btn_searchTitle").click();
				e.preventDefault();
				return false;
			}
		});

		$("#btn_searchTitle").click(function(){
			//$.getJSON("/api/y24/" + $("#search_title").val(), function(dat){
			var scr = document.createElement("scr" + "ipt");
			scr.src = "http://www.yes24.com/SearchCorner/Sniper/GetSniperSearchJsonp?Query=" + escape($("#search_title").val()) + "&Parsing=false&Domain=1&Page=0&PageSize=20&callback=requestCallback";
			$("head")[0].appendChild(scr);
			$("#search_results").empty();
		});
});
