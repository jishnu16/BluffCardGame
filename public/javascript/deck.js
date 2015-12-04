var ld = require('lodash');
var playerLib = require('./player.js').lib;
var lib = {};
exports.lib = lib;

lib.Card = function(nameOfCards,suit){
	this.name = nameOfCards;
	this.suit = suit;
};
lib.Card.prototype.toString = function() {
	return this.name + '_' + 'of' + '_' + this.suit;
};

lib.generateCards = function(){
	var namedCards=['ace',2,3,4,5,6,7,8,9,10,'jack','queen','king']
	var suits = ['hearts','spades','clubs','diamonds'];
	var deckOfCards = ld.map(namedCards,function(name){
		return ld.map(suits,function(suit){
			return new lib.Card(suit,name);
		});
	});
	return ld.flattenDeep(deckOfCards);
};


lib.shuffle = function(cards){
	return ld.shuffle(cards);
};

lib.distributeCardsToPlayersHand = function(cards,player_names){
	var seperatedHands = lib.ceratingPlayerHand(cards);
	var player_info = [];
	player_names.forEach(function(eachPlayer){
		var player = new playerLib.Player(eachPlayer);
		for (var index = 0; index < seperatedHands.length; index++) {
			player.hand = seperatedHands[index];
		};
		player_info.push(player);
	});
	    return player_info
};

lib.ceratingPlayerHand = function(cards){
	var allHand=[[],[],[]];
	for (var cardsindex = 0; cardsindex < 17; cardsindex++){
		for (var allHandindex = 0; allHandindex < 3; allHandindex++) {
			allHand[allHandindex].push(cards.pop());
		}
	};
	return allHand;
};


