var lib = {};
var _ = require('lodash');
module.exports = lib;
lib.Player = function(playerName){
	this.name = playerName;
	this.hand = [];
	this.isturn = false;
};
lib.Player.prototype = {
	takeCard : function(card){
		this.hand.push(card);
	},
	playCards : function(throwCardsId){
		this.hand = this.hand.filter(function(card){
			return throwCardsId.indexOf(card.id) === -1;
		});
	}
}
