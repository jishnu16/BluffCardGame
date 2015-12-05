var handCardsData = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		return '<td>' + '<object data="../images/Playing_Cards/SVG-cards-1.3/'+singleCard.href+'"'+' type="image/svg+xml">'+'</object>'+'</td>'
	});
}
var onLoad = function(){
	$.get('handCards',function(data){
		$('#playerHand').html(handCardsData(data));
	});
}

$(document).ready(onLoad);

