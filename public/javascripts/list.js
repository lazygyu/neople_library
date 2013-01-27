$(function(){

var ListViewSettings = {
	'currentPage':0,
	'lists':[],
	'countPerPage':20,
	'totalCount':0,
	'sort':'',
	'keyword':''
};

function ListView(opt){
	var that = this;
	this.set = jQuery.extend(opt, ListViewSettings);
	var getList = function(pg){
		var url = '/api/list/page/';
		if( pg ){
			url += pg;
		}else{
			url += that.set.currentPage;
		}

		if( that.set.keyword ){
			url += '/keyword/' + that.set.keyword;
		}
		$.ajax({
				'url':url,
				'success':that.getListCallback
		});
	}
	this.getList = getList;

	var relativeDate = function(sdate, ddate){
		var diff = sdate - ddate;
		return diff;
	}

	var dateString = function(d){
		var str = "";
		str += d.getFullYear();
		str += "년 " + (d.getMonth() + 1) + "월 " + (d.getDate()) + "일";
		return str;
	}

	var makeMediaItem = function(book){
		var el = $("<div class='media'></div>");
		var str = "";
		var state = ['success', 'important', 'warning'];
		var state_label = ['대여가능', '대여중', '입고중'];
		
		str = "<a class='pull-left' href='/detail/" + book._id + "'><img class='media-object mainlist' data-src='holder.js/64x64' src='"+book.thumb+"' /></a>";
		str += "<div class='media-body'>";
		str += "<a href='/detail/" + book._id + "'><h4 class='media-heading'>" + book.title; 
		str += "<span class='label label-" + state[book.state] + "' style='margin-left:1em;'>" + state_label[book.state] + "</span>";
		str += "</h4></a>";
		str += "<div>저자: " + book.author;
		if( book.subtitle ){
			str += " / " + book.subtitle;
		}
		str += "</div>";
		if( book.state == 1 ){
			str += "대여한 사람 : " + book.rentHistory[book.rentHistory.length-1].name;
			str += " / 반납 예정일 : " + Math.floor(relativeDate(book.rentHistory[book.rentHistory.length-1].endDate, new Date().getTime()) / 86400000) + "일 후 (" + dateString(new Date(book.rentHistory[book.rentHistory.length-1].endDate)) + ")";
		}
		str += "</div>";
		el.append(str);
		return el;
	}

	var getListCallback = function(lists){
		$("#booklist").empty();
		for(var i = 0, l=lists.length;i<l;i++){
			$("#booklist").append( makeMediaItem(lists[i]) );
		}
	}
	this.getListCallback = getListCallback;
}
var listView = new ListView();

	listView.set.currentPage = 1;
	listView.getList();
	$("#searchForm").submit(function(){
			var key = $("#in_search").val();
			listView.set.keyword = key;
			listView.getList();
			return false;
	});
});
