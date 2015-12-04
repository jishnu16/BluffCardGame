var deckLib = require('../public/javascript/deck.js').lib;
var playerLib = require('../public/javascript/player.js').lib;
var expect = require('chai').expect;
var Card = new deckLib.Card;
var players = ['suman','surajit','jishnu'];
// deckLib.distributeCardsToPlayersHand(deckLib.generateCards(),players)


describe('Deck',function(){
	it('should have name and suit',function(){
		expect(Card).to.have.all.keys('name','suit');
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

	it('"ceratingPlayerHand" should creates hand for 3 player',function(){
		var cards = deckLib.generateCards();
		expect(deckLib.ceratingPlayerHand(cards).length).to.equal(3);
		expect(deckLib.ceratingPlayerHand(cards)[0].length).to.equal(17);
		expect(deckLib.ceratingPlayerHand(cards)[1].length).to.equal(17);
		expect(deckLib.ceratingPlayerHand(cards)[2].length).to.equal(17);

	});

	it('"distributeCardsToPlayersHand" should have name and hand',function(){
    	var playersInfo = deckLib.distributeCardsToPlayersHand(deckLib.generateCards(),players);
		expect(playersInfo.length).to.equal(3);
		expect(playersInfo[0].name).to.equal('suman');
		expect(playersInfo[0].hand.length).to.equal(17);
	})

});	