var playedCardIds = [];
var reloadCards = function(){
		var card = $(this).attr('id');
		playedCardIds.push(card);
		alert(playedCardIds);
};

var unicodeRepresentationOfCards = function(suit){
	switch(suit){
		case 'hearts': return '<span style="color:red">♥</span>';
		case 'spades': return '♠';
		case 'diamonds': return '<span style="color:red">♦</span>';
		case 'clubs': return '♣';

	}
};

var generateHandCard = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		return '<td id ="'+singleCard.id + '"class = "playerCard"'+'><div class="'+singleCard.suit+'">'+ singleCard.name+'</br>'+unicodeRepresentationOfCards(singleCard.suit)+'</div></td>';
	});
}
var generateLogTableData = function(data){
	var tableData = JSON.parse(data);
	return tableData.map(function(singleData){
		if(singleData.action == 'played'){
			return '<tr><td>'+singleData.name+'  played  '+singleData.cards.length+'  cards</td></tr>';
		}
		if(singleData.action == 'pass'){
			return '<tr><td>'+singleData.name+' say passed </td></tr>';
		}

	});
}
var uniqueElementArray = function(cards){
	return cards.filter(function(card,index,array){
		return array.indexOf(card) === index;
	});
};
var getGameStatus = function(){
	$.get('serveTurnMessage',function(data){
		var turnMessage = JSON.parse(data).isTurn;
		var isNewRound = JSON.parse(data).isNewRound;
		if(turnMessage == false){
			$('#playCard').prop('disabled', true);
			$('#pass').prop('disabled', true);
			$('#playerHand').off('click');
			$('#listOfcardName').prop('disabled',true);

		}
		if(turnMessage == true){
			if(isNewRound == true)
				$('#listOfcardName').prop('disabled',false);
			    $('#playCard').prop('disabled', false);
				$('#pass').prop('disabled', false);
				$('#playerHand').on('click','td',function(){
					var card = $(this).attr('id');
					this.style.backgroundColor = "#C0C0C0";
					playedCardIds.push(card);
					playedCardIds = uniqueElementArray(playedCardIds);
			});
		}
		$('#turnName').html(JSON.parse(data).name);
	})
	
	$.get('tableData',function(data){
		$('#logTable').html(generateLogTableData(data));
	});
};
var onLoading = function(){
	var Interval = setInterval(getGameStatus,3000)
	$.get('handCards',function(data){
		$('#playerHand').html(generateHandCard(data));
	});
	$('#pass').click(function(){
		alert('ON PASS');
		$.post('pass');		
	})

	$('#playCard').click(function(){
		$.post('playCard',JSON.stringify(playedCardIds));
		$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
		});
		playedCardIds = [];
	});
}
$(document).ready(onLoading);


