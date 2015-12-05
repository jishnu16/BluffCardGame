var deckLib = require('../public/javascript/deck.js').lib;
var playerLib = require('../public/javascript/player.js').lib;
var expect = require('chai').expect;
var Card = new deckLib.Card;
var players = ['suman','surajit','jishnu'];


describe('Deck',function(){
	it('should have name and suit',function(){
		expect(Card).to.have.all.keys('name','suit','href');
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
	it('have a toString function it will return a string of card name along with suit',function(){
		var card = new deckLib.Card(10,'hearts');
		expect(card.href).to.equal('10_of_hearts.svg'); 
	})
})