var handCardsData = function(handedCards){
	var handedCards = JSON.parse(handedCards);
	return handedCards.map(function(singleCard){
		return '<td>' + '<img src = "../images/Playing\ Cards/SVG-cards-1.3/' +singleCard+'">'+'</td>'
	});
}
var onload = function(){
	$.get('handCards',function(data){
		$('#playerHand').html(handCardsData(data));
	});
}

$(document).ready(onLoad);