var deckLib = require('../lib/deck.js');
var playerLib = require('../lib/player.js');
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

