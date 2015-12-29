var game = require('../lib/game.js');
var Game = game.Game;
var sinon = require('sinon');	
var expect = require('chai').expect;
var assert = require('chai').assert;

beforeEach(function(){
	game = new Game();
});

describe('Game',function(){
	describe('hasVacancy',function(){
		it('should return true when no player joining the  game',function(){
			assert.ok(game.hasVacancy());
		})
		it('should return false when 3 players already joined the  game',function(){
			game.players = [{},{},{}];
			assert.notOk(game.hasVacancy());
		})
		it('should return true when 2 players already joined the  game',function(){
			game.players = [{},{}];
			assert.ok(game.hasVacancy());
		})
	})
	describe('isAlreadyJoin',function(){
		it('should return true when a player already joined',function(){
			game.players = [{name:'santa'}]
			assert.ok(game.isAlreadyJoin('santa'));
		})
		it('should return false when a player didn\'t join the game',function(){
			game.players = [{name:'santa'}]
			assert.notOk(game.isAlreadyJoin('santaraam'));
		})
	})
	describe('joinPlayer',function(){
		it('should join a player in the game',function(){
			game.joinPlayer('santa');
			assert.equal(game.players.length,1)
		})
	})
	describe('startGame',function(){
		it('indicates the game is started or not',function(){
			game.players = [{isturn:false}]
			game.startGame()

		})
	})
	describe('findRequestedPlayer',function(){
		it('should give the player who is requested',function(){
			game.players = [{name:'santa',hand:[]}]	
			var result = game.findRequestPlayer('santa');
			assert.deepEqual(result,{name:'santa',hand:[]})
		})
		it('should give undefined when requested player is not present in game',function(){
			game.players = [{name:'santaraam',hand:[]}];	
			var result = game.findRequestPlayer('santa');
			assert.notOk(result)
		})
	});
	describe('isGameStarted',function(){
		it('should return true when game is started',function(){
			game.isStarted = true;
			assert.ok(game.isGameStarted());
		});
		it('should return false when game is not started',function(){
			assert.notOk(game.isGameStarted());
		});
	})
	describe('isPlayer',function(){
		it('should return true when a player is already present in game',function(){
			game.players = [{name:'santa'}];
			assert.ok(game.isPlayer('santa'));
		})
		it('should return false when a player is not present in game',function(){
			game.players = [{name:'santa'}];
			assert.notOk(game.isPlayer('santaraam'));
		})
	})
	describe('setNameCard',function(){
		it('should set the requested name card',function(){
			game.setNameCard('queen');
			assert.equal('queen',game.namedCard);
			game.setNameCard(8);
			assert.equal(8,game.namedCard);
		})
	})
	describe('changePlayerTurn',function(){
		it('should change the turn current player to next player',function(){
			game.players = [{isturn:true},{isturn:false},{isturn:false}]
			var expected = [{isturn:false},{isturn:true},{isturn:false}]
			game.changePlayerTurn();
			assert.deepEqual(expected,game.players)
		})
	})
	describe('isNewRound',function(){
		it('should return true when action log is empty',function(){
			game.actionLog = [];
			assert.ok(game.isNewRound())
		});
		it('should return false when actionLog is less than 3',function(){
			game.actionLog = [{},{}];
			assert.notOk(game.isNewRound())
		});
		it('should return false until 3 consecutive pass happened',function(){
			game.actionLog = [{action:'pass'},{action:'played'},{action:'pass'}];
			assert.notOk(game.isNewRound())
		});
		it('should return true when 3 consecutive pass happened',function(){
			game.actionLog = [{action:'pass'},{action:'pass'},{action:'pass'}];
			assert.ok(game.isNewRound())
		});
	})
	describe('canBluff',function(){
		it('should return true when actionlog is not empty',function(){
			game.actionLog = [{},{}]
			assert.ok(game.canBluff());
		});
		it('should return false when actionlog is empty',function(){
			game.actionLog = [];
			assert.notOk(game.canBluff());
		});
	})
	describe('getLastPlayedCards',function(){
		it('when only one player played card it will give those card',function(){
			game.actionLog = [{cards:['H7']}]
			assert.deepEqual(game.getLastPlayedCards(),['H7'])
		});
		it('when multiple player played card it will give last player\'s played cards',function(){
			game.actionLog = [{cards:['H7','C7']},{cards:['D7','HK']},{cards:['C5']}]
			assert.deepEqual(game.getLastPlayedCards(),['C5']);
		});
	})
	describe('checkRoundCards',function(){
		it('should return false when player not played predefined round\'s rank card',function(){
			game.namedCard = "king";
			game.getLastPlayedCards = function(){return [{name:'king'},{name:'queen'}]}
			// game.actionLog = [{cards:}];
			assert.notOk(game.checkRoundCards());
		});
		it('should return true when player played predefined round\'s rank card',function(){
			game.namedCard = 'king';
			game.getLastPlayedCards = function(){return [{name:'king'},{name:'king'}]}
			// game.actionLog = [{cards:[{name:'king'},{name:'king'}]}];
			assert.ok(game.checkRoundCards());
		});
	})
})
