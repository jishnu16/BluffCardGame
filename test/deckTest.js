var deckLib = require('../public/javascript/deck.js').lib;
var playerLib = require('../public/javascript/player.js').lib;
var expect = require('chai').expect;

var players = ['suman','surajit','jishnu'];



describe('Deck',function(){
	var Card = new deckLib.Card('ace','hearts');
	it('should have name and suit',function(){
		expect(Card).to.have.all.keys('name','suit','href','id');
	});
	it('Card should return an object',function(){
		expect(Card).to.be.a('object');
	});

	it('"generateCards" should have generate 52 playable cards',function(){
		expect(deckLib.generateCards().length).to.equal(52);
	});

	it('"shuffle" should returned 52 cards after shuffling the deck',function(){
		expect(deckLib.shuffle(deckLib.generateCards()).length).to.equal(52);
	});

	it('"creatingPlayerHand" should creates hand for 3 player',function(){
		var cards = deckLib.generateCards();
		expect(deckLib.creatingPlayerHand(cards).length).to.equal(3);
		expect(deckLib.creatingPlayerHand(cards)[0].length).to.equal(17);
		expect(deckLib.creatingPlayerHand(cards)[1].length).to.equal(17);
		expect(deckLib.creatingPlayerHand(cards)[2].length).to.equal(17);

	});

	it('"distributeCardsToPlayersHand" should have name and hand',function(){
    	var playersInfo = deckLib.distributeCardsToPlayersHand(deckLib.generateCards(),players);
		expect(playersInfo.length).to.equal(3);
		expect(playersInfo[0].name).to.equal('suman');
		expect(playersInfo[0].hand.length).to.equal(17);
	})

});	


describe("card",function(){
	describe('setHref',function(){
		it('should generate a string that contain svg link by name and suit',function(){
			var card = new deckLib.Card(10,'hearts');
			expect(card.href).to.equal('10_of_hearts.svg'); 
		})
	})
	describe('id',function(){
		it('should generate a unique card id by card name and suit',function(){
			var card = new deckLib.Card(10,'hearts');
			expect(card.id).to.equal('H10'); 
		})
	})
	it('should has four field',function(){
		var card = new deckLib.Card(10,'hearts');
		expect(Object.keys(card).length).to.equal(4)
	})
})
describe('changePlayerTurn',function(){
	it('')
})

describe('removePlayedCardsFromPlayerHand',function(){
	it('should remove card from player hand',function(){
		var player = {hand:[{id:'H7'},{id:'H10'},{id:'H9'},{id:'H8'}]};
		expect(deckLib.removePlayedCardsFromPlayerHand(player,['H9','H7'])).to.eql({hand:[{id:'H10'},{id:'H8'}]})
	})
	it('should remove card from player hand',function(){
		var player = {hand:[{id:'H7'},{id:'H10'}]};
		expect(deckLib.removePlayedCardsFromPlayerHand(player,['H10','H7'])).to.eql({hand:[]})
	})
	it('should not remove card from player hand when the id array is empty',function(){
		var player = {hand:[{id:'H7'},{id:'H10'}]};
		expect(deckLib.removePlayedCardsFromPlayerHand(player,[])).to.eql({hand:[{id:'H7'},{id:'H10'}]})
	})
})
