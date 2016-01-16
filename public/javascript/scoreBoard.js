var requestGameResult = function(){
	$.get('result',function(data){
		var players = JSON.parse(data);
		console.log(players);
		var allPlayer = {player:players};
		$('#player').html(score(allPlayer));
		$('#card').html(cardsAfterFinished(allPlayer));
		$('#position').html(positionOfPlayer(allPlayer));

	});
};
var positionOfPlayer = function(json){
	var ul = $('#position');
	var initialPosition = 1;
	$.each(json.player,function(index,player){
		ul.append("<h3>"+initialPosition+"st"+"</h3>");
		initialPosition++;
	});
}
var score = function(json){
	var ul = $('#player');
	$.each(json.player,function(index,player){
		ul.append("<h3>"+player.name+"</h3>")
	});
}
var cardsAfterFinished = function(json){
	var ul = $('#card');
	$.each(json.player,function(index,player){
		ul.append("<h3>"+player.noOfCards+"</h3>")
	});
}
var onReady = function(){
	requestGameResult();
}
$(document).ready(onReady);
