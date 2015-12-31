var Deck = require('../lib/deck.js').Deck;
var assert = require('chai').assert;


describe('Deck',function(){
	describe('generateCards',function(){
		it('should generate 52 cards',function(){
			assert.equal(new Deck().pack.length,52);
		});
	})
});	


