var ld = require('lodash');
var playerLib = require('./player.js').lib;
var lib = {};
exports.lib = lib;
var setHref = function(name,suit){
	return name + '_' + 'of' + '_' +suit+'.svg';
}
var generateCardId = function(name,suit){
	if(typeof(name) == 'string')
		return suit[0].toUpperCase() + name[0].toUpperCase();
	return suit[0].toUpperCase() + name;
};
lib.Card = function(nameOfCards,suit){
	this.name = nameOfCards;
	this.suit = suit;
	this.href = setHref(nameOfCards,suit);
	this.id = generateCardId(nameOfCards,suit);
};

lib.generateCards = function(){
	var namedCards=['ace',2,3,4,5,6,7,8,9,10,'jack','queen','king']
	var suits = ['hearts','spades','clubs','diamonds'];
	var deckOfCards = ld.map(namedCards,function(name){
		return ld.map(suits,function(suit){
			return new lib.Card(name,suit);
		});
	});
	return ld.flattenDeep(deckOfCards);
};


lib.shuffle = function(cards){
	return ld.shuffle(cards);
};

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
	if(actionLog.length == 0){
		return true;
	}
	else if(actionLog.length<3)
		return false;
	else{
		for (var i = actionLog.length-1 ; i >= actionLog.length -3 ; i--) {
			if(actionLog[i].action != 'pass')
				flag = false;
		};
	}
	return flag;
}

