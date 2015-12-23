var ld = require('lodash');
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





