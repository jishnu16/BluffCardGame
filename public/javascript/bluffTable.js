var playedCardIds = [];
var getHandCardStatus = function(){
	$.get('getStatus',function(data){
			var card = JSON.parse(data);
			$('#playerHand').html(generateHandCard(data));
	});
}

var unicodeOfCards = function(suit,rank){
	var spanForSuit = '<span class = "suit"';
	var spanForRank = '<span class = "rank"';
	switch(suit){
		case 'hearts':return spanForRank+ 'style="color:red">'+rank+'</span>'+spanForSuit+'style="color:red">♥</span>';
		case 'spades':return spanForRank+'>' +rank+'</span>'+spanForSuit+'>♠</span>';
		case 'diamonds':return spanForRank+ 'style="color:red">'+rank+'</span>'+spanForSuit+'style="color:red">♦</span>';
		case 'clubs':return spanForRank+'>'+rank+'</span>'+spanForSuit+'>♥</span>';
	}
};


var generateHandCard = function(cards){
	var handedCards = JSON.parse(cards);
	return handedCards.map(function(singleCard){
		var rank = singleCard.name;
		var suit = singleCard.suit;
		return '<div id ="'+singleCard.id + '"class = "playerCard">'
		+ unicodeOfCards(suit,rank)+'</div>';
	});
}

var generateLogTableData = function(data){
	var tableData = JSON.parse(data);
	var lastElement = tableData[tableData.length-1];
		 if(lastElement && lastElement.action == 'played'){
			$('#playedStatus').html(lastElement.name+'  played  '+lastElement.cards.length+'  cards');
			$('#passing').html('');
		}
		if(lastElement && lastElement.action == 'pass')
			$('#passing').html(lastElement.name+' say passed');
		
}

var generateChallengeData = function(data){
	var challengeStuatus = JSON.parse(data);
	if(challengeStuatus.length>0)
		return challengeStuatus[0]+ ' Challenged '+challengeStuatus[1]+' & '+ challengeStuatus[2]+' Lost';
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
		$('.opponent1 > .data').html( opponent1.name +"	 "+opponent1.noOfCards+'   cards');
		$('.opponent2 > .data').html( opponent2.name +"	   "+ opponent2.noOfCards+'   cards');
		$('.ownPlayer > .data').html(ownPlayer.name +"    "+ ownPlayer.noOfCards+' cards');
		changeTurnColour(opponent1);
		changeTurnColour(opponent2);
		changeTurnColour(ownPlayer);
	})
}
var changeTurnColour = function(player){
	return (player.isturn == true) ?
		$('.'+player.div).css({"box-shadow":"5px 5px 15px #3F3F3F"}) : $('.'+player.div).css({"box-shadow":"none"});
}
var giveButtonDisable = function(){
	$('#playCard').prop('disabled', true);
	$('#pass').prop('disabled', true);
	$('#playerHand').off('click');
	$('#listOfcardName').css("visibility","hidden");
	$('#selectNamedCard').prop('disabled',true);
	$('#bluff').prop('disabled',true);
}

var giveButtonAble = function(isNewRound,turnMessage){
	if(turnMessage && isNewRound){
		$('#listOfcardName').css("visibility","visible");
		$('#pass').prop('disabled', false);
	    $('#playCard').prop('disabled', false);
	    $('#bluff').prop('disabled',false);
	}
	else if(isNewRound){
		$('#selectNamedCard').prop('disabled',false);
		$('#pass').prop('disabled', true);
		$('#playCard').prop('disabled',false);
	    $('#bluff').prop('disabled',true);
	}
	else{
		$('#pass').prop('disabled', false);
	    $('#playCard').prop('disabled', false);
	    $('#bluff').prop('disabled',false);
	    $('#listOfcardName').css('visibility','hidden');
	}
}

var clickOnCards = function(){
	$('#playerHand').on('click','div',function(){
		var card = $(this).attr('id');
		this.style.backgroundColor = "#C0C0C0";
		playedCardIds.push(card);
		playedCardIds = uniqueElementArray(playedCardIds);
		console.log(playedCardIds);
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
			giveButtonAble(isNewRound,turnMessage);
			clickOnCards();
		}
		$('.turnName').html(JSON.parse(data).name);
		if(isNewRound == true){
			$('#passing').html("New round starting");
			$('#namedCard').html('');
		}	
		else
			$('#namedCard').html(namedCard);
	})

	$.get('tableData',function(data){
		generateLogTableData(data);
	});
	$.get('getChallengeStatus',function(data){
		var challengeData = generateChallengeData(data);
		if(challengeData)
			$('#playedStatus').html(challengeData);
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
		console.log(playedCardIds);
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
	var Interval = setInterval(getGameStatus,1000);
	getHandCard();
	clickOnPass();
	clickToSelectNamedCard();
	clickToPlayCards();
	clickForBluff();
}
$(document).ready(onLoading);
