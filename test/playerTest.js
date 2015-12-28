var sinon = require('sinon');
var player = require('../lib/player.js');
var Player = player.Player;
var sinon = require('sinon');	
var expect = require('chai').expect;
var assert = require('chai').assert;
beforeEach(function(){
	player = new Player();
});

describe('player',function(){
	describe('takeCard',function(){
		it('should give a card to player hand' ,function(){
			player.hand = [];
			expected = [{}];
			player.takeCard({});
			assert.deepEqual(expected,player.hand)
		});
		it('should give a card to player hand when player already have cards' ,function(){
			player.hand = [{},{},{}];
			expected = [{},{},{},{}];
			player.takeCard({});
			assert.deepEqual(expected,player.hand);
		});
	})
	describe('playCards',function(){
		it('should remove the cards from player hand which player played',function(){
			player.hand = [{id:'S7'},{id:'DK'},{id:'H7'}];
			expected = [{id:'S7'},{id:'DK'}];
			player.playCards(['H7']);
			assert.deepEqual(expected,player.hand);
		});
		it('should remove the cards from player hand when player played multiple cards',function(){
			player.hand = [{id:'S7'},{id:'DK'},{id:'H7'}];
			expected = [{id:'DK'}];
			player.playCards(['H7','S7']);
			assert.deepEqual(expected,player.hand);
		});
		it('should remove the cards from player hand when player did not any card',function(){
			player.hand = [{id:'S7'},{id:'DK'},{id:'H7'}];
			expected = [{id:'S7'},{id:'DK'},{id:'H7'}];
			player.playCards([]);
			assert.deepEqual(expected,player.hand);
		});
	})
})