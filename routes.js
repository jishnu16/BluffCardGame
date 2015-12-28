var fs = require('fs');
var ld = require('lodash');


var serveLoginPage = function(req,res,next){
	req.url = '/login.html';
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


var serveWaitingMessage = function(req,res,name){
	var message = '<h2>'+name+' your registration successful</h2><h3>Waiting for other player<h>';
	res.end(message);
};

var serveMainGamePage = function(req,res){
	res.writeHead(302, {'Location': 'main.html'});
	res.end();
};

var joinPlayer = function(req,res,playerName){
	res.writeHead(200 ,{'Set-Cookie':playerName});
	req.game.joinPlayer(playerName);							
	if(req.game.hasVacancy())						
		serveWaitingMessage(req,res,playerName);					
	else{
		res.end(JSON.stringify({isStarted : req.game.isGameStarted()}));			
	}
};

var requestForJoining = function(req,res,next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	})
	req.on('end',function(){
		if(req.game.hasVacancy() && !req.game.isAlreadyJoin(data))
			joinPlayer(req,res,data);
		if(req.game.isAlreadyJoin(data))
			res.end('already join');
		else
			res.end('try after some time');				
	})
};	

var serveCards = function(req,res){
	var playerName = req.headers.cookie;
	var requestedPlayer = req.game.findRequestPlayer(playerName);
	requestedPlayer ? res.end(JSON.stringify(requestedPlayer.hand)) : res.end();
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

var serveTurnMessage = function(req,res){
	var requestedPlayerName = req.headers.cookie;
	var requestedPlayer = req.game.findRequestPlayer(requestedPlayerName);
	if(requestedPlayer){
		var turn =req.game.players.filter(function(player){
			return player.isturn == true;
		})[0];
		var turnData = { isTurn:requestedPlayer.isturn , name:turn.name ,isNewRound:req.game.isNewRound(),namedCard:req.game.namedCard}
		res.end(JSON.stringify(turnData));
	}
	res.end();
		
};

var serveTableUpdate = function(req,res,next){
	var requestedPlayerName = req.headers.cookie;
	if(req.game.isPlayer(requestedPlayerName))
		res.end(JSON.stringify(req.game.actionLog));   //gameObject.serveActionLOgData()
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
	{path: '^/serveTurnMessage$',handler:serveTurnMessage},
	{path: '^/$', handler: serveLoginPage},
	{path: '^/update$' , handler:serveUpdate},
	{path: '^/getStatus$' , handler:getStatus},
	{path: '^/handCards$',handler:serveCards},
	{path: '^/tableData$',handler:serveTableUpdate},
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