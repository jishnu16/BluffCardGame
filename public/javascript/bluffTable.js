var handCardsData = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		return '<td id ="'+singleCard.id+'" ><div class="'+singleCard.suit+'">'+singleCard.name+'</br>'+singleCard.suit+'</div></td>';
	});
}
var getGameStatus = function(){
	$.get('getStatus',function(data){
		var card = JSON.parse(data);
		$('#playerHand').html(handCardsData(data));
	})
}
var onLoading = function(){
	var playedCardIds = [];
	$.get('handCards',function(data){
		$('#playerHand').html(handCardsData(data));
	});
	var Interval = setInterval(getGameStatus,3000)
	$('#playerHand').on('click','td',function(){
		var card = $(this).attr('id');
		playedCardIds.push(card);
		alert(playedCardIds);
	});

	$('#playCard').click(function(){
		alert (playedCardIds);
		$.post('playCard',JSON.stringify(playedCardIds))
	})

}


$(document).ready(onLoading);


