var module = require('./deck.js').lib;
var playerLib = require('./player.js').lib;
var ld = require('lodash');
var lib = {};
exports.lib = lib;
lib.distributeCardsToPlayersHand = function(cards,player_names){
	var seperatedHands = lib.creatingPlayerHand(cards);
	var playerInfo = [];
	player_names.forEach(function(eachPlayer){
		playerInfo.push(new playerLib.Player(eachPlayer))
	});
	var player_info = playerInfo.map(function(player,index){
		player.hand = seperatedHands[index];
		return player;
	});
	return player_info;
};
lib.creatingPlayerHand = function(cards){
	var allHand=[[],[],[]];
	for (var cardsindex = 0; cardsindex < 17; cardsindex++){
		for (var allHandindex = 0; allHandindex < 3; allHandindex++) {
			allHand[allHandindex].push(cards.pop());
		}
	};
	return allHand;
};

lib.removePlayedCardsFromPlayerHand = function(player,idsOfPlayedCards){

	player.hand = player.hand.filter(function(obj){
		return idsOfPlayedCards.indexOf(obj.id) === -1;
	})
	return player;
};

lib.changePlayerTurn = function(){
	var count = 1;
	return function(players){
		players[(count)-1].isturn = false;
		count = count%3;
		players[count].isturn = true;
		count++;
		return players
	}
}();

lib.isNewRound = function(actionLog){
	var flag = true;
	if(actionLog.length == 0)
		return true;
	else if(actionLog.length<3)
		return false;
	else{
		for (var index = actionLog.length-1 ; index >= actionLog.length -3 ; index--) {
			if(actionLog[index].action != 'pass')
				flag = false;
		};
	}
	return flag;
}
lib.generateCardById = function(cardIds){
	var cardNameAndSuit = cardIds.map(function(eachId){
		var cardSuit = eachId[0];
		var suits = {'H':'hearts','S':'spades','C':'clubs','D':'diamonds'}
		var cardObject ={};
		cardObject.suit = suits[cardSuit];
		var name = eachId.slice(1);
		if(typeof(+name) == 'number')
			cardObject.name = +name;
		switch(name){
			case 'A': cardObject.name='ace'; 
				break;
			case 'K': cardObject.name='king';
				break;
			case 'Q': cardObject.name='queen';
				break;
			case 'J': cardObject.name='jack';
				break;
		}
		return cardObject;
	})
	var generatedCards = cardNameAndSuit.map(function(eachCard){
		return new module.Card(eachCard.name,eachCard.suit);
	})
	return generatedCards;
}

lib.pushAllPlayedCardToPlayerHand = function(players,playerName,playerActionLog){
	var selectedPlayer = players.filter(function(player){
				if(player.name == playerName)
					return player;
			})[0];
			var allCards = [];				
			playerActionLog.forEach(function(singleTurn){
				if(singleTurn.cards)
					allCards.push(singleTurn.cards);
			})
			selectedPlayer.hand.push(allCards);
			selectedPlayer.hand = ld.flattenDeep(selectedPlayer.hand);
			return players;
}

lib.decideBluff = function(players,playerActionLog,namedCard,challengerName){
	if(playerActionLog.length>0){
		console.log(playerActionLog)
		console.log(players[0].hand)
		var lastPlayedCards = playerActionLog[playerActionLog.length-1].cards;
		var result = lastPlayedCards.every(function(singleCard){
			return singleCard.name == namedCard;
		}) 
		if(result == true){
			pushAllPlayedCardToPlayerHand(players,challengerName,playerActionLog);
			return;
		}
		else{
			var looserName = playerActionLog[playerActionLog.length -1].name;
			pushAllPlayedCardToPlayerHand(players,looserName,playerActionLog);
			return;
		}
	}
}
