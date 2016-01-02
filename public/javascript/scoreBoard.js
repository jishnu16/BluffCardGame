var requestGameResult = function(){
	$.get('result',function(data){
		var players = JSON.parse(data);
		var allPlayer = {player:players};
		$('#score').html(score(allPlayer));
	});
};
var score = function(json){
	var ul = $('#score');
	$.each(json.player,function(index,element){
		ul.append("<li>"+element.name+" "+element.noOfCards+"</li>")
	});
}
var onReady = function(){
	requestGameResult();
}
$(document).ready(onReady);

