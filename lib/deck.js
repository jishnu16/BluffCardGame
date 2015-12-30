var Card = require('./card.js');
var ld = require('lodash');
var lib = {};
module.exports = lib;

lib.Deck = function(){
	this.pack;
	this.generateCards();
};
lib.Deck.prototype = {
	generateCards : function(){
		var rank=['ace',2,3,4,5,6,7,8,9,10,'jack','queen','king']
		var suits = ['hearts','spades','clubs','diamonds'];
		var pack = [];
		rank.forEach(function(eachRank){
			suits.forEach(function(eachSuit){
				pack.push(new Card(eachRank,eachSuit))
			})
		});
		this.pack = pack;	
	}
}






