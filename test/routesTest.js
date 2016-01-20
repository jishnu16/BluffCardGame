var Controller = require('../controller.js');

var request = require('supertest');
var sinon = require('sinon');
var controller;
var games = {};
var game = {};
beforeEach(function(){
	game = {};
	controller = new Controller(games);
});

describe('routes',function(){
	describe('/',function(){
		it('should give login page',function(done){
			request(controller)
				.get('/')
				.expect(200)
				.expect(/Bluff login/,done)
		});
	});
	describe('/update',function(){
		it('should give false when no player join the game',function(done){
			var expected = JSON.stringify({isStarted : false})
			games.loadGame = function(){return game};
			game.isGameStarted = sinon.stub().returns(false);
			request(controller)
				.get('/update')
				.expect(200)
				.expect(expected,done)
		});
		it('should give true after three player join the game',function(done){
			var expected = JSON.stringify({isStarted : true});
			games.loadGame = function(){return game};
			game.isGameStarted = sinon.stub().returns(true);
			request(controller)
				.get('/update')
				.expect(200)
				.expect(expected,done)
		});
	})
	describe(' POST /joingame',function(){
		it('inform player\'s name in login page and serve waiting message',function(done){
			games.loadGame = function(){return game};
			game.joinPlayer = sinon.spy();
			game.startGame = sinon.stub().throws(new Error('xyz'));
			game.getGameId = sinon.stub().returns(1);
			request(controller)
				.post('/joingame')
				.send('name=Ratan')
				.expect(200)
				.expect('set-cookie',/Ratan/)
				.expect(/xyz/,done)
		});
		it('should give status of game started for last player join',function(done){
			games.loadGame = function(){return game};
			game.getGameId = sinon.stub().returns(1);
			game.startGame = sinon.stub().returns(true);
			game.joinPlayer = sinon.spy();

			var expected = JSON.stringify({isStarted : true});
			request(controller)
				.post('/joingame')
				.set('Cookie','surajit')
				.send('surajit')
				.expect(200)
				.expect(expected,done)
		});
	})
	describe('/handCards',function(){
		it('should serve all cards which are in requested player hand',function(done){
			games.loadGame = function(){return game};
			game.getPlayerCards = sinon.stub().returns([{name:3},{name:4},{name:9}]);

			var expected = JSON.stringify([{name:3},{name:4},{name:9}])
			request(controller)
				.get('/handCards')
				.set('Cookie','cookieName=name=jishnu')
				.expect(200)
				.expect(expected,done)
		});
	});
	describe('POST /setNamedCard',function(){
		it('should set requested namedCard',function(done){
			games.loadGame = function(){return game};
			game.isPlayer = sinon.stub().returns(true);
			game.isNewRound = sinon.stub().returns(true);
			game.setNameCard = sinon.spy();
			request(controller)
				.post('/setNamedCard')
				.set('Cookie','cookieName=name=jishnu')
				.send('setCard=king')
				.expect(200,done)
		});
	});
	describe('POST /playCard',function(){
		it('should requested for played card\'s',function(done){
			games.loadGame = function(){return game};
			game.players = [{},{},{}];
			game.findRequestPlayer = sinon.stub().returns({ name:'ramlal',hand:[{},{}]});
			game.getPlayedCards = sinon.spy();
			game.actionLog = [];
			request(controller)
				.post('/playCard')
				.set('Cookie','cookieName=jishnu')
				.send(JSON.stringify(['H7','S9']))
				.expect(200,done)
		});
	});
	describe('/getStatus',function(){
		it('should serve current status of requested player hand',function(done){
			games.loadGame = function(){return game};
			game.isPlayer = sinon.stub().returns(true);
			game.getPlayerCards = sinon.stub().returns([{name:3},{name:4},{name:9}]);
			var expected = JSON.stringify([{name:3},{name:4},{name:9}])
			request(controller)
				.get('/getStatus')
				.set('Cookie','cookieName=name=jishnu')
				.expect(expected)
				.expect(200,done)

		});
	});
	describe('POST /pass',function(){
		it('should post the status of player\'s pass',function(done){
			games.loadGame = function(){return game};
			game.actionLog = [];
			game.players = [{},{},{}]
			game.changeTurnAfterPass = sinon.spy();
			request(controller)
				.post('/pass')
				.set('Cookie','cookieName=jishnu')
				.expect(200,done)
		});
	});
	describe('POST /bluff',function(){
		it('should post the status of bluff',function(done){
			games.loadGame = function(){return game};
			game.namedCard = 2;
			game.actionLog=[{},{name:'ramukaka',action:'played',cards:[{name:2},{name:2}]}];
			game.players = [{name:'jishnu',hand:[]},{},{}];
			game.decideBluff = sinon.spy();
			request(controller)
				.post('/bluff')
				.set('Cookie','cookieName=jishnu')
				.expect(200,done)
		});
	});
	describe('/serveGameStatus',function(){
		it('should serve the information about player turn',function(done){
			var expected = JSON.stringify({ isTurn:false , name:'ramlal' ,isNewRound:true,namedCard:'notSet',isGameEnded:false});
			games.loadGame = function(){return game};
			game.findRequestPlayer = sinon.stub().returns({name:'jishnu',isturn:false});
			game.getCurrentPlayer = sinon.stub().returns({name:'ramlal',isturn:true});
			game.actionLog = [];
			game.isNewRound = sinon.stub().returns(true);
			game.namedCard = 'notSet';
			game.isGameFinish = sinon.stub().returns(false);
			request(controller)
				.get('/serveGameStatus')
				.set('Cookie','cookieName=jishnu')
				.expect(expected)
				.expect(200,done)
		});
	});
	describe('/tableData',function(){
		it('should serve the status of the played card',function(done){
			games.loadGame = function(){return game};
			game.actionLog = [];
			game.isPlayer = sinon.stub().returns(true);
			request(controller)
				.get('/tableData')
				.set('Cookie','cookieName=jishnu')
				.expect('[]')
				.expect(200,done)
		});
	});
});
