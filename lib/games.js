var deck = require('./deck.js');
var lib = require('./game.js');
var _ = require('lodash');
var cookieParser = require('cookie-parser');
var Game = lib.Game;
var Deck = deck.Deck;

lib = {};
module.exports = lib;
lib.Games = function(){
	this.games = [];
};
lib.Games.prototype = {
	loadGame:function(req){
		var requestedGameId= undefined;
		if(req.cookies.cookieName)
			requestedGameId =req.cookies.cookieName.gameId;
		if(requestedGameId != undefined){
			return this.games[+requestedGameId -1];
		}
		else{
			if(this.games.length>0){
				var game = this.games[this.games.length -1];
				if(game.hasVacancy()){
					return game;
				}
				else {
					return this.startNewGame();
				}
			}
			else{
				return this.startNewGame();
			}
		}
	},
	startNewGame : function(){
		this.createGame();
		var game = this.games[this.games.length-1];
		return game;
	},
	createGame:function(){
		var game = new Game(new Deck().pack,this.games.length+1);
		this.games.push(game);
	} 
}
