// var deckLib = require('/deck.js').lib;
var lib = {};
exports.lib = lib;

lib.Player = function(playerName){
	this.name = playerName;
	this.hand = [];
};
