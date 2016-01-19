var games = require('../lib/games.js');
var Games = games.Games;
var sinon = require('sinon');
var expect = require('chai').expect;
var assert = require('chai').assert;

beforeEach(function(){
	games = new Games();
});
describe('Games',function(){
	describe('loadGame',function(){
		it('should give new a game when no game in Games',function(){
			var req = {};
			req.cookies = {};
			var game = games.loadGame(req);
			assert.equal(game.hasVacancy(),true);
			assert.equal(game.players.length,0);
		});
		it('should give game when no game in Games',function(){
			var req = {};
			req.cookies = {};
			req.cookies.cookieName = {};
			req.cookies.cookieName.gameId ='1';
			games.games = [];
			games.startNewGame();
			var game = games.loadGame(req);
			assert.equal(game.hasVacancy(),true);
			assert.equal(game.players.length,0);
			assert.equal(game.id,1);
		});
		it('should give game when no game in Games',function(){
			var req = {};
			req.cookies = {};
			games.games = [];
			games.createGame();
			var game = games.loadGame(req);
			assert.equal(game.hasVacancy(),true);
			assert.equal(game.players.length,0);
			assert.equal(game.id,1);
		});
	})
	describe('startNewGame',function(){
		it('should create a new agme and return that game',function(){
			games.createGame = sinon.spy();
			games.games = [];
			games.startNewGame();
			assert.ok(games.createGame.called);
		});
	})
	describe('createGame',function(){
		it('should create a new agme and return that game',function(){
			games.games = [];
			games.createGame();
			assert.equal(games.games.length,1);
		});
	})
})