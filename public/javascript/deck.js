var ld = require('lodash');
var playerLib = require('./player.js').lib;
var lib = {};
exports.lib = lib;
var setHref = function(name,suit){
	return name + '_' + 'of' + '_' +suit+'.svg';
}
lib.Card = function(nameOfCards,suit){
	this.name = nameOfCards;
	this.suit = suit;
	this.href = setHref(nameOfCards,suit)
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


