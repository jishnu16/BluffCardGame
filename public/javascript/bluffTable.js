var playedCardIds = [];
var getHandCardStatus = function(){
	$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
	});
}

var unicodeOfCards = function(suit){
	var span = '<span class = "suit"';
	switch(suit){
		case 'hearts': return span+'style="color:red">♥</span>';
		case 'spades': return span+'>♠</span>';
		case 'diamonds': return span+'style="color:red">♦</span>';
		case 'clubs': return span+'>♣</span>';
	}
};

var generateHandCard = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		var rank = singleCard.name.toString()[0].toUpperCase();
		var suit = singleCard.suit;
		return '<td id ="'+singleCard.id + '"class = "playerCard"'+'><div class="'+suit+'">'
		+ rank+'</br>'+unicodeOfCards(suit)+'</div></td>';
	});
}

var generateLogTableData = function(data){
	var tableData = JSON.parse(data);
	return tableData.map(function(singleData){
		if(singleData.action == 'played'){
			return '<tr><td>'+'<b>'+singleData.name+'</b>'+'  played  '
			+singleData.cards.length+'  cards</td></tr>';
		}
		if(singleData.action == 'pass'){
			return '<tr><td>'+singleData.name+' say passed </td></tr>';
		}

	});
}

var generateChallengeData = function(data){
	var challengeStuatus = JSON.parse(data);
	if(challengeStuatus.length>0)
		return challengeStuatus[0]+ ' Challenge '+challengeStuatus[1]+' & '+ challengeStuatus[2]+' Loose the challenge';
	return '';
}

var uniqueElementArray = function(cards){
	return cards.filter(function(card,index,array){
		return array.indexOf(card) === index;
	});
};

var getCardStatus = function(playerName){
	$.get('getCardStatus',function(data){
		var status = JSON.parse(data);
		var opponent1 = status[1];
		opponent1.div = "opponent1";
		var opponent2 = status[2];
		opponent2.div = "opponent2";
		var ownPlayer = status[0];
		ownPlayer.div = "ownPlayer";
		$('.opponent1').html('<h3>'+ opponent1.name + '</br>' + opponent1.noOfCards+'   cards');
		$('.opponent2').html('<h3>'+ opponent2.name + '</br>' + opponent2.noOfCards+'   cards');
		$('.ownPlayer').html('<h3>'+ ownPlayer.name +"   "+ ownPlayer.noOfCards+'   cards');
		changeTurnColour(opponent1);
		changeTurnColour(opponent2);
		changeTurnColour(ownPlayer);
	})
}
var changeTurnColour = function(player){
	return (player.isturn == true) ?
		$('.'+player.div).css({"background-color":"#b5e685"}) : $('.'+player.div).css({"background-color":"#c2c5f1"});
}
var giveButtonDisable = function(){
	$('#playCard').prop('disabled', true);
	$('#pass').prop('disabled', true);
	$('#playerHand').off('click');
	$('#listOfcardName').prop('disabled',true);
	$('#selectNamedCard').prop('disabled',true);
	$('#bluff').prop('disabled',true);
}

var giveButtonAble = function(isNewRound){
	if(isNewRound == true){
		$('#listOfcardName').prop('disabled',false);
		$('#selectNamedCard').prop('disabled',false);
		$('#pass').prop('disabled', true);
		$('#playCard').prop('disabled',false);
	    $('#bluff').prop('disabled',true);
	}
	else{
		$('#pass').prop('disabled', false);
    $('#playCard').prop('disabled', false);
    $('#bluff').prop('disabled',false);
	}
}

var clickOnCards = function(){
	$('#playerHand').on('click','td',function(){
		var card = $(this).attr('id');
		this.style.backgroundColor = "#C0C0C0";
		playedCardIds.push(card);
		playedCardIds = uniqueElementArray(playedCardIds);
	});
}

var getGameStatus = function(){
	getCardStatus();

	$.get('serveGameStatus',function(data){
		var gameStatus = JSON.parse(data);
		var gameEndingStatus = gameStatus.isGameEnded;
		var turnMessage = gameStatus.isTurn;
		var isNewRound = gameStatus.isNewRound;
		var namedCard = gameStatus.namedCard;
		if(gameEndingStatus == true){
			window.location.href = '/scoreBoard.html'
		}
		if(turnMessage == false){
			giveButtonDisable();
			getHandCardStatus();
		}
		if(turnMessage == true){
			giveButtonAble(isNewRound);
			clickOnCards();
		}
		$('.turnName').html(JSON.parse(data).name);
		if(isNewRound == true)
			$('#namedCard').html("New round starting");
		else
			$('#namedCard').html(namedCard);
	})

	$.get('tableData',function(data){
		$('#logTable').html(generateLogTableData(data));
	});
	$.get('getChallengeStatus',function(data){
		$('#challenge').html(generateChallengeData(data));
	})
};

var clickOnPass = function(){
	$('#pass').click(function(){
		$.post('pass');
		playedCardIds = [];
	});
}

var clickToSelectNamedCard = function(){
	$('#playCard').click(function(){
		var value = $('#listOfcardName').val();
		var roundCard = {setCard:value};
		$.post('setNamedCard',roundCard);
	});
}

var clickToPlayCards = function(){
	$('#playCard').click(function(){
		var table = {cards:playedCardIds};
		$.post('playCard',table);
		$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
		});
		playedCardIds = [];
	});
}

var clickForBluff = function(){
	$('#bluff').click(function(){
		$.post('bluff');
		$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));

		});
		playedCardIds = [];
	});

}

var getHandCard = function(){
	$.get('handCards',function(data){
		$('#playerHand').html(generateHandCard(data));
	});
};

var onLoading = function(){
	// var Interval = setInterval(getGameStatus,1000);
	getHandCard();
	clickOnPass();
	clickToSelectNamedCard();
	clickToPlayCards();
	clickForBluff();
}
$(document).ready(onLoading);
