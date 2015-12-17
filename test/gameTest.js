var game = require('../javascript/game.js').lib;
var deckLib = require('../javascript/deck.js').lib;
var expect = require('chai').expect;
var assert = require('chai').assert;
var players = ['suman','surajit','jishnu'];

describe('changePlayerTurn',function(){
	it('should change the turn to the next player',function(){
		var players = [{isturn:true},{isturn:false}];
		expected = [{isturn:false},{isturn:true}];
		assert.deepEqual(expected,game.changePlayerTurn(players));
	});
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
})
describe('creatingPlayerHand',function(){
	it('should creates hand for 3 player',function(){
		var cards = deckLib.generateCards();
		expect(game.creatingPlayerHand(cards).length).to.equal(3);
		expect(game.creatingPlayerHand(cards)[0].length).to.equal(17);
		expect(game.creatingPlayerHand(cards)[1].length).to.equal(17);
		expect(game.creatingPlayerHand(cards)[2].length).to.equal(17);

	});
})
	
describe('distributeCardsToPlayersHand',function(){
	it('should have name and hand',function(){
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
describe('generateCardById',function(){
	it('should generate cards by given card\'s id ',function(){
		var ids = ['H7','C5','CJ','S10','D6','DA']
		var result = game.generateCardById(ids);
		var expected = [{name:7,suit:'hearts',href:'7_of_hearts.svg',id:'H7'},
						{name:5,suit:'clubs',href:'5_of_clubs.svg',id:'C5'},
						{name:'jack',suit:'clubs',href:'jack_of_clubs.svg',id:'CJ'},
						{name:10,suit:'spades',href:'10_of_spades.svg',id:'S10'},
						{name:6,suit:'diamonds',href:'6_of_diamonds.svg',id:'D6'},
						{name:'ace',suit:'diamonds',href:'ace_of_diamonds.svg',id:'DA'}];
		expect(result).to.eql(expected)
	})
})

describe('pushAllPlayedCardToPlayerHand',function(){
	it('should give all played cards to hand of given name player',function(){
		var playerActionLog= [ { name: 'suman',action: 'played',
		cards: [{name:7,suit:'hearts',href:'7_of_hearts.svg',id:'H7'},
		{name:5,suit:'clubs',href:'5_of_clubs.svg',id:'C5'}] } ];
		var players = [{name:'suman',hand :[]},{name:'jishnu',hand :[]},{name:'surajit',hand :[]}];
		var playerName = 'suman';
		var result = game.pushAllPlayedCardToPlayerHand(players,playerName,playerActionLog);
		var expected = [{name:'suman',hand :[
		{name:7,suit:'hearts',href:'7_of_hearts.svg',id:'H7'},
		{name:5,suit:'clubs',href:'5_of_clubs.svg',id:'C5'}]},
		{name:'jishnu',hand :[]},{name:'surajit',hand :[]}];
		expect(result).to.eql(expected);
	})
})












