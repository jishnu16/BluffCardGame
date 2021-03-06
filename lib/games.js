var deck = require('./deck.js');
var lib = require('./game.js');
var _ = require('lodash');
var chance = require('chance');
var chance1 = new chance();
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
		var requestedGameId=undefined;
		if(req.cookies.cookieName)
			requestedGameId =req.cookies.cookieName.gameId;
		if(requestedGameId != undefined){
			return this.findGame(requestedGameId);
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
	findGame : function(gameId){
		return _.find(this.games,{id:gameId})

	},
	startNewGame : function(){
		this.createGame();
		var game = this.games[this.games.length-1];
		return game;
	},
	createGame:function(){
		var game = new Game(new Deck().pack,chance1.integer());
		this.games.push(game);
	},
	romeveGame :function(id){
		_.remove(this.games,{id:id});
	} 
}
