function Model(){ }

Model.prototype.makeListItem = function(dat, opt){
	var tar_url = '/detail/' + dat.ISBN;
	if( !opt ) opt = {};
	if( opt.tar_url ) tar_url = opt.tar_url;
	var label_data = [
			{class:'success', label:'대여가능'},
			{class:'error', label:'대여중'},
			{class:'warning', label:'구매요청'}
		];
	var el = $("<div class='media'></div>");
	el.append("<a href='" + tar_url + "' class='pull-left'><img class='media-object' src='http://image.yes24.com/goods/"+dat.yes24_id+"' class='image-polaroid' style='width:60px;' /></a>");
	var str = "<div class='media-body'>";
	if( dat.subtitle ){
		str += "<span class='muted'>" + dat.subtitle + "</span>";
	}
	str += "<a href='" + tar_url + "'>";
	str += "<h4 class='media-heading'>" + dat.title;
	str += "<span class='label label-" + label_data[dat.state].class + "' style='margin-left:1em;'>" + label_data[dat.state].label + "</span>";
	str += "</h4>";
	str += "</a>";
	str += "<div>" + dat.author + "</div>";
	str += "</div>";
	el.append(str);
	return el;
}

Model.prototype.getList = function(opt){
	var that = this;
	var url_str = '';
	var tmp = [];
	for(var i in opt.query){
		if( !opt.query.hasOwnProperty(i) ) continue;
		tmp.push(i + '/' + opt.query[i]);
	}
	url_str = tmp.join('/');
	var tar = opt.target;
	$.getJSON("/api/list/" + url_str, function(list){
			$(opt.target).empty();
			if(list.length > 0 ){
				for(var i=0,l=list.length;i<l;i++){
					$(opt.target).append(that.makeListItem(list[i]));
				}
			}else{
				$(opt.target).append("<span class='muted'>목록에 도서가 없습니다.</span>");
			}
	});
}

var model = new Model();
