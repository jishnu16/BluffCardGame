var playedCardIds = [];
var getHandCardStatus = function(){
	$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
	});
}

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
var getCardStatus = function(playerName){
	$.get('getCardStatus',function(data){
		var status = JSON.parse(data);
		var firstOpponent = status[0];
		var secondOpponent = status[1];
		$('#opponentOne').html('<h3>'+ firstOpponent.name + '</br>' + firstOpponent.noOfCards);
		$('#opponentTwo').html('<h3>'+ secondOpponent.name + '</br>' + secondOpponent.noOfCards);
	})
}
var getGameStatus = function(){
	getCardStatus();
	$.get('serveGameStatus',function(data){
		var gameEndingStatus = JSON.parse(data).isGameEnded;
		var turnMessage = JSON.parse(data).isTurn;
		var isNewRound = JSON.parse(data).isNewRound;
		var namedCard = JSON.parse(data).namedCard;
		if(gameEndingStatus == true){
			window.location.href = '/scoreBoard.html'
		}
		$('#bluff').prop('disabled',false);
		if(turnMessage == false){
			$('#playCard').prop('disabled', true);
			$('#pass').prop('disabled', true);
			$('#playerHand').off('click');
			$('#listOfcardName').prop('disabled',true);
			$('#selectNamedCard').prop('disabled',true);
			getHandCardStatus();
		}
		if(turnMessage == true){
			if(isNewRound == true){
				$('#listOfcardName').prop('disabled',false);
				$('#selectNamedCard').prop('disabled',false);
				$('#pass').prop('disabled', true);
				$('#playCard').prop('disabled',false);

			}
			else{
				$('#pass').prop('disabled', false);
			    $('#playCard').prop('disabled', false);
			}
			$('#playerHand').on('click','td',function(){
				var card = $(this).attr('id');
				this.style.backgroundColor = "#C0C0C0";
				playedCardIds.push(card);
				playedCardIds = uniqueElementArray(playedCardIds);
			});
		}
		$('#turnName').html(JSON.parse(data).name);
		if(isNewRound == true)
			$('#namedCard').html("new round starting");
		else
			$('#namedCard').html(namedCard);
	})
	
	$.get('tableData',function(data){
		$('#logTable').html(generateLogTableData(data));
	});
};
var onLoading = function(){
	var Interval = setInterval(getGameStatus,1000);
	$.get('handCards',function(data){
		$('#playerHand').html(generateHandCard(data));
	});
	$('#pass').click(function(){
		$.post('pass');	
		playedCardIds = [];	
	});
	$('#selectNamedCard').click(function(){
		var value = $('#listOfcardName').val();
		var roundCard = {setCard:value};
		$.post('setNamedCard',roundCard)
	});
	$('#playCard').click(function(){
		var table = {cards:playedCardIds};
		$.post('playCard',table);		
		$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
		});
		playedCardIds = [];
	});
	$('#bluff').click(function(){
		$.post('bluff');
		$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
		});
		playedCardIds = [];
	})
}
$(document).ready(onLoading);