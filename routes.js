var fs = require('fs');
var ld = require('lodash');

var serveLoginPage = function(req,res,next){
	req.url = '/index.html';
	next();
};

var serveStaticFile = function(req,res,next){
	var path = './public' + req.url;
	fs.readFile(path,function(err,data) {
		if(data){
			res.statusCode = 200;
			res.end(data);
		}
		else
			next();
	});
};

var fileNotFound = function(req,res){
	res.statusCode = 404;
	res.end('data not found');
};

var notAllowed = function(req ,res){
	res.statusCode = 405;
	res.end('not allowed');
};

var serveMainGamePage = function(req,res){
	res.writeHead(302, {'Location': 'main.html'});
	res.end();
};

var joinPlayer = function(req,res,playerName){
	res.writeHead(200 ,{'Set-Cookie':playerName});
	try{
		req.game.joinPlayer(playerName);
		res.end(JSON.stringify({isStarted : req.game.startGame()}));
	}
	catch(err) {
		   res.end(err.message);
	}
};

var requestForJoining = function(req,res,next){
	var playerName = '';
	req.on('data',function(chunk){
		playerName+=chunk;
	})
	req.on('end',function(){
		joinPlayer(req,res,playerName);
	})
};	

var serveCards = function(req,res){
	var playerName = req.headers.cookie;
	try{
		var requestedPlayer = req.game.findRequestPlayer(playerName);
		res.end(JSON.stringify(requestedPlayer.hand));
	}
	catch(err){
		res.end(err.message);
	}
}
var serveUpdate = function(req,res){
	res.end(JSON.stringify({isStarted : req.game.isGameStarted()}));
};

var requestForPlayCards = function(req,res,next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	})
	req.on('end',function(){
		var requestedPlayerName = req.headers.cookie;
		req.game.getPlayedCards(JSON.parse(data),requestedPlayerName);
		res.end();
	});
};

var requestForPass = function(req,res){
	req.on('end',function(){
		var player = req.headers.cookie;
		req.game.changeTurnAfterPass(player);
	})
	res.end();	
};


var getStatus = function(req,res){
	var requestedPlayerName = req.headers.cookie;
	if(req.game.isPlayer(requestedPlayerName))
		serveCards(req,res);
};

var serveGameStatus = function(req,res){
	try{
		var requestedPlayerName = req.headers.cookie;
		var requestedPlayer = req.game.findRequestPlayer(requestedPlayerName);
		var currentPlayer = req.game.getCurrentPlayer();
		var gameStatus = { 
			isTurn:requestedPlayer.isturn ,
			name:currentPlayer.name ,
			isNewRound:req.game.isNewRound(),
			namedCard:req.game.namedCard,
			isGameEnded : req.game.isGameFinish(),
		};
		res.end(JSON.stringify(gameStatus));
	}
	catch(err){
		res.end(err.message);
	};
};

var serveTableUpdate = function(req,res,next){
	var requestedPlayerName = req.headers.cookie;
	if(req.game.isPlayer(requestedPlayerName))
		res.end(JSON.stringify(req.game.actionLog));   
	res.end();
}
var requestForSetNamedCard = function(req,res){
	var requestedPlayerName = req.headers.cookie;
	if(req.game.isPlayer(requestedPlayerName)){
		var data = '';
		req.on('data',function(chunk){
			data+=chunk;
		})
		req.on('end',function(){
			req.game.setNameCard(data);
			res.end();
		})
	}
}
var requestForBluff = function(req,res){
	var challengerName = req.headers.cookie;
	req.game.decideBluff(challengerName);
		res.end();
}
var resultOfGame = function(req,res){
	res.end(JSON.stringify(req.game.getPlayerHandCardsLength()));
}

var post_handlers = [
	{path : '^/joingame$' , handler : requestForJoining},
	{path : '^/setNamedCard$' , handler : requestForSetNamedCard},
	{path : '^/bluff$' , handler : requestForBluff},
	{path : '^/playCard$' , handler : requestForPlayCards},
	{path: '^/pass$' , handler : requestForPass},
	{path: '', handler: serveStaticFile},
	{path : '',handler : notAllowed}
];

var get_handlers = [
	{path: '^/serveGameStatus$',handler:serveGameStatus},
	{path: '^/$', handler: serveLoginPage},
	{path: '^/update$' , handler:serveUpdate},
	{path: '^/getStatus$' , handler:getStatus},
	{path: '^/handCards$',handler:serveCards},
	{path: '^/tableData$',handler:serveTableUpdate},
	{path: '^/result$', handler:resultOfGame},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];


var EventEmitter = require('events').EventEmitter;
var Emitter = new EventEmitter();

var matchHandler = function(url){
	return function(ph){
		return url.match(new RegExp(ph.path));
	};
};

Emitter.on('next',function(handlers,req,res,next){
	if(handlers.length == 0) return;
	var ph = handlers.shift();
	ph.handler(req,res,next);
});

var allGetHandler = function(req,res){
	var handlers = get_handlers.filter(matchHandler(req.url));
	var next = function(){

		Emitter.emit('next',handlers,req,res,next);
	}
	next();
};

var allPostHandler = function(req,res){
	var handlers = post_handlers.filter(matchHandler(req.url));
	var next = function(){
		Emitter.emit('next',handlers,req,res,next);
	};
	next();
};

var requestHandler = function  (req,res) {
	if(req.method == 'GET')
		allGetHandler(req,res);
	else if(req.method == 'POST')
		allPostHandler(req,res);
};

var Controller=function(game) {
	return function(req,res){
		req.game = game;
	requestHandler(req,res)
	}
}

module.exports = Controller;
