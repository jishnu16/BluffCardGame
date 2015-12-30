var Controller = require('../routes.js');
var request = require('supertest');
var sinon = require('sinon');
var controller;
var game = {};
beforeEach(function(){
	game = {};
	controller = new Controller(game);
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
			game.isGameStarted = sinon.stub().returns(false);
			request(controller)
				.get('/update')
				.expect(200)
				.expect(expected,done)
		});
		it('should give true after three player join the game',function(done){
			var expected = JSON.stringify({isStarted : true});
			game.isGameStarted = sinon.stub().returns(true);
			request(controller)
				.get('/update')
				.expect(200)
				.expect(expected,done)
		});
	})
	describe(' POST /joingame',function(){
		it('inform player\'s name in login page and serve waiting message',function(done){
			game.joinPlayer = sinon.spy();
			game.startGame = sinon.stub().throws(new Error('xyz'));
			request(controller)
				.post('/joingame')
				.send('Ratan')
				.expect(200)
				.expect('set-cookie','Ratan')
				.expect(/xyz/,done)
		});
		it('should give status of game started for last player join',function(done){
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
			game.findRequestPlayer = sinon.stub().returns({hand:['cards']});
			var expected = JSON.stringify(['cards'])
			request(controller)
				.get('/handCards')
				.set('Cookie','jishnu')	
				.expect(200)
				.expect(expected,done)
		});
	}); 
	describe('POST /setNamedCard',function(){
		it('should set requested namedCard',function(done){
			game.isPlayer = sinon.stub().returns(true);
			game.setNameCard = sinon.spy();
			request(controller)
				.post('/setNamedCard')
				.set('Cookie','jishnu')	
				.send('king')
				.expect(200)
				.end(done)
				
		});
	});
	describe('POST /playCard',function(){
		it('should requested for played card\'s',function(done){
			game.players = [{},{},{}]
			game.findRequestPlayer = sinon.stub().returns({ name:'ramlal',hand:[{},{}]});
			game.getPlayedCards = sinon.spy();
			game.actionLog = [];
			request(controller)
				.post('/playCard')
				.set('Cookie','jishnu')	
				.send(JSON.stringify(['H7','S9']))
				.expect(200,done)
		});
	});
	describe('/getStatus',function(){
		it('should serve current status of requested player hand',function(done){
			game.isPlayer = sinon.stub().returns(true);
			game.findRequestPlayer = sinon.stub().returns({hand:['cards']});
			var expected = JSON.stringify(['cards'])
			request(controller)
				.get('/getStatus')
				.set('Cookie','jishnu')
				.expect(expected)
				.expect(200,done)
				
		});
	});
	describe('POST /pass',function(){
		it('should post the status of player\'s pass',function(done){
			game.actionLog = [];
			game.players = [{},{},{}]
			game.changeTurnAfterPass = function(){}
			request(controller)
				.post('/pass')
				.set('Cookie','jishnu')
				.expect(200,done)
		});
	});
	describe('POST /bluff',function(){
		it('should post the status of bluff',function(done){
			game.namedCard = 2;
			game.actionLog=[{},{name:'ramukaka',action:'played',cards:[{name:2},{name:2}]}];
			game.players = [{name:'jishnu',hand:[]},{},{}];
			game.decideBluff = sinon.spy();
			request(controller)
				.post('/bluff')
				.set('Cookie','jishnu')
				.expect(200,done)
		});
	});
	describe('/serveTurnMessage',function(){
		it('should serve the information about player turn',function(done){
			var expected = JSON.stringify({ isTurn:false , name:'ramlal' ,isNewRound:true,namedCard:'notSet'});
			game.findRequestPlayer = sinon.stub().returns({name:'jishnu',isturn:false});
			game.getCurrentPlayer = sinon.stub().returns({name:'ramlal',isturn:true});
			game.actionLog = [];
			game.isNewRound = sinon.stub().returns(true);
			game.namedCard = 'notSet'
			request(controller)
				.get('/serveTurnMessage')
				.set('Cookie','jishnu')
				.expect(expected)
				.expect(200,done)
		});	
	});
	describe('/tableData',function(){
		it('should serve the status of the played card',function(done){
			game.actionLog = [];
			game.isPlayer = sinon.stub().returns(true);
			request(controller)
				.get('/tableData')
				.set('Cookie','jishnu')
				.expect('[]')
				.expect(200,done)
		});	
	});
});













