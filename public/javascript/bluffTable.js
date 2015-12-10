var playedCardIds = [];
var reloadCards = function(){
		var card = $(this).attr('id');
		playedCardIds.push(card);
		alert(playedCardIds);
};
var generateHandCard = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		return '<td id ="'+singleCard.id + '"class = "playerCard"'+'><div class="'+singleCard.suit+'">'+singleCard.name+'</br>'+singleCard.suit+'</div></td>';
	});
}
var generateLogTableData = function(data){
	var tableData = JSON.parse(data);
	return tableData.map(function(singleData){
		return '<tr><td>'+singleData.name+'  played  '+singleData.noOfPlayedCards+'  cards</td></tr>';
	});
}
var getGameStatus = function(){
	$.get('serveTurnMessage',function(data){
		var turnMessage = JSON.parse(data);
		if(turnMessage == false){
			$('#playCard').prop('disabled', true);
			$('#pass').prop('disabled', true);
			$('#playerHand').off('click');
		}
		if(turnMessage == true){
			    $('#playCard').prop('disabled', false);
				$('#pass').prop('disabled', false);
				$('#playerHand').on('click','td',function(){
				var card = $(this).attr('id');
				playedCardIds.push(card);
				alert(playedCardIds);
			});
		}
		alert(turnMessage);
	})
	$.get('getStatus',function(data){
		var card = JSON.parse(data);
		$('#playerHand').html(generateHandCard(data));
	});
	$.get('tableData',function(data){
		$('#logTable').html(generateLogTableData(data));
	});
};
var onLoading = function(){
	// var playedCardIds = [];
	var Interval = setInterval(getGameStatus,3000)
	$.get('handCards',function(data){
		$('#playerHand').html(generateHandCard(data));
	});
	// $('#playerHand').on('click','td',function(){
	// 	var card = $(this).attr('id');
	// 	playedCardIds.push(card);
	// 	alert(playedCardIds);
	// });
	$('#playCard').click(function(){
		$.post('playCard',JSON.stringify(playedCardIds))
		playedCardIds = [];
	});
}


$(document).ready(onLoading);


