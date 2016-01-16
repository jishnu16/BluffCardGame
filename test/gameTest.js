var game = require('../lib/game.js');
var Deck = require('../lib/deck.js').Deck;
var Player = require('../lib/player.js').Player;
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
			game.players = [{name:'ramu'},{name:'santa'}]
			assert.ok(game.isAlreadyJoin('santa'));
		})
		it('should return false when a player didn\'t join the game',function(){
			game.players = [{name:'santa'}]
			assert.notOk(game.isAlreadyJoin('santaraam'));
		})
	})
	describe('joinPlayer',function(){
		it('should join a player in the game only if it hasVacancy',function(){
			game.players = [];
			game.joinPlayer('one');
			game.joinPlayer('two');
			game.joinPlayer('three');
			assert.equal(game.players.length,3)
		})
		it('should not join a player in the game if already joined',function(){
			game.players = [];
			game.joinPlayer('one');
			game.joinPlayer('two');
			assert.throw(function() { game.joinPlayer('two'); },Error, 'already joined');

			assert.equal(game.players.length,2)
		})
		it('should not be able to join a player in the game if no hasVacancy',function(){
			game.players = [{},{},{}];
			assert.throw(function() { game.joinPlayer('four'); },Error, 'try after some time');
			assert.equal(game.players.length,3)
		})
	})
	describe('startGame',function(){
		it('indicates the game is started or not',function(){
			game.players = [{isturn:false},{},{}]
			game.startGame();
			assert.equal(game.isGameStarted(),true);
			assert.equal(game.players[0].isturn,true);
		})
		it('game should not start if hasVacancy',function(){
			game.players = [{isturn:false},{}];
			assert.throw(function() { game.startGame(); },Error, 'waiting for other players to join');
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
			assert.throw(function() { game.findRequestPlayer('santa'); },Error,'player not found');
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
			game.actionLog = [{action:'played',cards:['H7']}]
			assert.deepEqual(game.getLastPlayedCards(),['H7'])
		});
		it('when multiple player played card it will give last player\'s played cards',function(){
			game.actionLog = [{action:'played',cards:['H7','C7']},{action:'played',cards:['D7','HK']},{action:'played',cards:['C5']}]
			assert.deepEqual(game.getLastPlayedCards(),['C5']);
		});
	})
	describe('checkRoundCards',function(){
		it('should return false when player not played predefined round\'s rank card',function(){
			game.namedCard = "king";
			game.getLastPlayedCards = function(){return [{name:'king'},{name:'queen'}]}
			assert.notOk(game.checkRoundCards());
		});
		it('should return true when player played predefined round\'s rank card',function(){
			game.namedCard = 'king';
			game.getLastPlayedCards = function(){return [{name:'king'},{name:'king'}]}
			assert.ok(game.checkRoundCards());
		});
	})
	describe('getEmptyHandPlayer',function(){
		it('Should return player whose hand is empty',function(){
			game.players=[{name:'suman',hand:['DK','C5','HQ']},{name:'barney',hand:[]},{name:'suzi',hand:['CK','H4']}];
			var expected = game.getEmptyHandPlayer();
			assert.deepEqual(expected,{name:'barney',hand:[]});
		});
		it('Should return undefined when no players hand is empty',function(){
			game.players=[{name:'suman',hand:['DK','C5','HQ']},{name:'barney',hand:['SK']},{name:'suzi',hand:['CK','H4']}];
			var expected = game.getEmptyHandPlayer();
			assert.deepEqual(expected,undefined);
		})
	})
	describe('isGameFinish',function(){
		it('should return true when a player\'s hand is empty and next player is played cards',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:[]},{name:'suzi',hand:['CK']}];
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'played'}];
			assert.ok(game.isGameFinish());
		});
		it('should return false when a player\'s hand is empty and he is the last player who played cards',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:['CK']},{name:'suzi',hand:[]}];
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'played'}];
			assert.notOk(game.isGameFinish());
		});
		it('should return false when a player\'s hand is empty and last player say pass',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:[]},{name:'suzi',hand:['HK']}];
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'pass'}];
			assert.notOk(game.isGameFinish());
		});
		it('should return false when a player\'s hand is empty and last player say pass',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:[]},{name:'suzi',hand:['HK']}];
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'}];
			assert.notOk(game.isGameFinish());
		});
		it('should return true when a player\'s hand is empty and after playing last player hand is also empty',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:[]},{name:'suzi',hand:[]}];
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'played'}];
			assert.ok(game.isGameFinish());
		});
		it('should return true when a player\'s hand is empty and a new round going to start',function(){
			game.players=[{name:'suman',hand:['DK','C5']},{name:'barney',hand:[]},{name:'suzi',hand:[]}];
			game.actionLog = [];
			assert.ok(game.isGameFinish());
		})
	})

	describe('getLastPlayedPlayer',function(){
		it('should return the last player action log who played cards',function(){
			game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'played'}];
			var expected = {name:'suzi',action:'played'};
			assert.deepEqual(expected,game.getLastPlayedPlayer());
		})
		it('should return the last player action log who played cards',function(){
				game.actionLog = [{name:'suman',action:'played'},{name:'barney',action:'played'},{name:'suzi',action:'pass'}];
				var expected = {name:'barney',action:'played'};
				assert.deepEqual(expected,game.getLastPlayedPlayer());
		})
	})
	describe('getShortedPlayersByHand',function(){
		it('should return the last player action log who played cards',function(){
			game.players = [{name:'suman',hand:[{},{}]},{name:'barney',hand:[{}]},{name:'suzi',hand:[{},{},{}]}];
			var expected = [{name:'barney',hand:[{}]},{name:'suman',hand:[{},{}]},{name:'suzi',hand:[{},{},{}]}];
			assert.deepEqual(expected,game.getShortedPlayersByHand());
		})
	})	
	describe('updateActionLog',function(){
		it('should update the actiol log',function(){
			game.actionLog = [];
			game.updateActionLog({action:'pass'});
			assert.deepEqual([{action:'pass'}],game.actionLog)
		})
		it('should update the actiol log',function(){
			game.actionLog =  [{action:'pass'},{action:'played'},{action:'pass'}];
			game.updateActionLog({action:'played'});
			var expected = [{action:'pass'},{action:'played'},{action:'pass'},{action:'played'}];
			assert.deepEqual(expected,game.actionLog);
		})
	})
	describe('deleteActionlog',function(){
		it('should delete the previous action log',function(){
			game.actionLog = [{action:'pass'},{action:'played'},{action:'pass'}];
			game.deleteActionlog();
			assert.deepEqual([],game.actionLog);
		})
	})
	describe('getActionLog',function(){
		it('should give the action log',function(){
			game.actionLog = [{action:'pass'},{action:'played'},{action:'pass'}];
			var expected = [{action:'pass'},{action:'played'},{action:'pass'}];
			game.getActionLog();
			assert.deepEqual(expected,game.actionLog);
		})
	})
	describe('getPlayedCards',function(){
		it('should remove cards from player after play',function(){
			var player = {name:'hari',isturn:true,hand:[{id:'H7'},{id:'C5'},{id:'DK'},{id:'SQ'}]}
			game.players = [player,{isturn:false},{isturn:false}];
			player.playCards = function(){ player.hand = [{id:'DK'},{id:'SQ'}]};
			game.getPlayedCards(['C5','H7'],'hari');
			game.findRequestPlayer = function(){return {name:'hari',hand:[{id:'H7'},{id:'C5'},{id:'DK'},{id:'SQ'}]}};
			game.updateActionLog = function(){};
			game.changePlayerTurn = function(){};

			var expected = [{id:'DK'},{id:'SQ'}];
			assert.deepEqual(expected,player.hand);

		})
	})
	describe('getCardStatus',function(){
		it('should return how many cards left other players hand',function(){
			game.players = [{name:'hari',hand:[{},{},{},{},{}]},{name:'mathur',hand:[{},{},{}]},{name:'raghu',hand:[{},{},{}]}];
			var expected = [{name:'mathur',noOfCards:3},{name:'raghu',noOfCards:3},{name:'hari',noOfCards:5}];
			assert.deepEqual(expected,game.getCardStatus('mathur'));
		})
	})
	describe("getPlayerCards",function(){
		it("should give cards of player hand",function(){
			var player = {name:'hari',isturn:true,hand:[{id:'H7'},{id:'C5'},{id:'DK'},{id:'SQ'}]}
			game.players = [player];
			var expected = [{id:'H7'},{id:'C5'},{id:'DK'},{id:'SQ'}];
			assert.deepEqual(game.getPlayerCards('hari'),expected);
		});
	})
	describe('getCurrentPlayer',function(){
		it('should give error if game is not started',function(){
			game.players = [{name:'kora',isturn:false},{name:'kagaj',isturn:true},{name:'dil',isturn:false}];
			game.isStarted = false;

			assert.throw(function() { game.getCurrentPlayer(); },Error,'game not yet started');
		});
		it('should give the player whose turn is going on',function(){
			game.players = [{name:'kora',isturn:false},{name:'kagaj',isturn:true},{name:'dil',isturn:false}];
			game.isStarted = true;
			var expected = {name:'kagaj',isturn:true};

			assert.deepEqual(expected,game.getCurrentPlayer());
		});
	})
	describe('deal',function(){
		it('should distribute cards to all player',function(){
		game.pack = new Deck().pack;
		game.players = [new Player('ram'),new Player('ramu'),new Player('kaka')];
		game.deal();
		assert.equal(game.players[0].hand.length,18);
		assert.equal(game.players[1].hand.length,17);
		assert.equal(game.players[2].hand.length,17);
		});
	})
	describe('decideBluff',function(){
		it('should decide result of chalange when last played player played right cards',function(){
			game.canBluff = sinon.stub().returns(true);
			game.checkRoundCards = sinon.stub().returns(true);
			game.findRequestPlayer = sinon.spy();
			game.takeRoundCards = sinon.spy();
			
			game.decideBluff();

			assert.ok(game.canBluff.called);
			assert.ok(game.checkRoundCards.called);
			assert.ok(game.findRequestPlayer.called);
			assert.ok(game.takeRoundCards.called);
		});
		it('should decide result of chalange when last played player played wrong cards',function(){
			game.canBluff = sinon.stub().returns(true);
			game.checkRoundCards = sinon.stub().returns(false);
			game.getLastPlayedPlayer = sinon.stub().returns({name:'abc'});
			game.findRequestPlayer = sinon.spy();
			game.takeRoundCards = sinon.spy();
			
			game.decideBluff();

			assert.ok(game.canBluff.called);
			assert.ok(game.checkRoundCards.called);
			assert.ok(game.getLastPlayedPlayer.called);
			assert.ok(game.takeRoundCards.called);
			assert.ok(game.findRequestPlayer.called);
		});
	})
	describe('takeRoundCards',function(){
		it('should give all played cards to the looser player hand',function(){
			var player = new Player('ramu');
			game.getAllPlayedCards = sinon.stub().returns([{},{},{}]);
			game.deleteActionlog = sinon.spy();
			game.takeRoundCards(player);
			assert.ok(game.getAllPlayedCards.calledOnce);
			assert.ok(game.deleteActionlog.calledOnce);
			assert.equal(player.hand.length,3);
		});
	})
	describe('getAllPlayedCards',function(){
		it('should collect all played cards from action log',function(){
			game.actionLog = [{name:'suman',action:'played',cards:[{},{},{}]},{name:'barney',action:'played'},{name:'suzi',action:'played'}];

		});
	})
})
