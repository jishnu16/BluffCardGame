var game = require('../javascript/game.js').lib;
var deckLib = require('../javascript/deck.js').lib;
var expect = require('chai').expect;
var assert = require('chai').assert;
var players = ['suman','surajit','jishnu'];

describe('changePlayerTurn',function(){
	it('')
})

describe('removePlayedCardsFromPlayerHand',function(){
	it('should remove card from player hand',function(){
		var player = {hand:[{id:'H7'},{id:'H10'},{id:'H9'},{id:'H8'}]};
		expect(game.removePlayedCardsFromPlayerHand(player,['H9','H7'])).to.eql({hand:[{id:'H10'},{id:'H8'}]})
	})
	it('should remove card from player hand',function(){
		var player = {hand:[{id:'H7'},{id:'H10'}]};
		expect(game.removePlayedCardsFromPlayerHand(player,['H10','H7'])).to.eql({hand:[]})
	})
	it('should not remove card from player hand when the id array is empty',function(){
		var player = {hand:[{id:'H7'},{id:'H10'}]};
		expect(game.removePlayedCardsFromPlayerHand(player,[])).to.eql({hand:[{id:'H7'},{id:'H10'}]})
	})

	it('"creatingPlayerHand" should creates hand for 3 player',function(){
		var cards = deckLib.generateCards();
		expect(game.creatingPlayerHand(cards).length).to.equal(3);
		expect(game.creatingPlayerHand(cards)[0].length).to.equal(17);
		expect(game.creatingPlayerHand(cards)[1].length).to.equal(17);
		expect(game.creatingPlayerHand(cards)[2].length).to.equal(17);

	});

	it('"distributeCardsToPlayersHand" should have name and hand',function(){
    	var playersInfo = game.distributeCardsToPlayersHand(deckLib.generateCards(),players);
		expect(playersInfo.length).to.equal(3);
		expect(playersInfo[0].name).to.equal('suman');
		expect(playersInfo[0].hand.length).to.equal(17);
	})
})
describe('isNewRound',function(){
	it('should return true when the game start',function(){
		var actionLog = [];
		assert.equal(true,game.isNewRound(actionLog));
	});
	it('should return false when two player played card',function(){
		var actionLog = [{action:'played'},{action:'played'}];
		assert.equal(false,game.isNewRound(actionLog));
	});
})













