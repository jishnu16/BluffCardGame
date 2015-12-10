var fs = require('fs');
var querystring = require('querystring');
var players = [];
var playerWithHand = [];
var isStarted = false;
var deckLib = require('./public/javascript/deck.js').lib;

var serveLoginPage = function(req,res,next){
	req.url = '/html/login.html';
	next();
};

var serveStaticFile = function(req,res,next){
	var path = './public' + req.url;
	fs.readFile(path,function(err,data) {
		if(data){
			res.statusCode = 200;
			res.end(data);
			console.log(res.statusCode);
		}
		else
			next();
	});
};

var fileNotFound = function(req,res){
	res.statusCode = 404;
	res.end('data not found');
	console.log(res.statusCode);
};

var notAllowed = function(req ,res){
	res.statusCode = 405;
	res.end('not allowed');
};

var startGame = function(){
	var shuffledCards = deckLib.shuffle(deckLib.generateCards());
	playerWithHand = deckLib.distributeCardsToPlayersHand(shuffledCards,players);
	playerWithHand[0].isturn = true;
};

var serveWaitingMessage = function(req,res,name){
	var message = '<h2>'+name+' your registration successful</h2><h3>Waiting for other player<h>';
	res.end(message);
};

var serveMainGamePage = function(req,res){
	res.writeHead(302, {'Location': 'html/main.html'});
	res.end();
};

var isJoined = function(req,res){
	return players.some(function(playerName){
		return playerName == req.headers.cookie;
	})
};

var joinPlayer = function(req,res,name){
	res.writeHead(200 ,{'Set-Cookie':name});
	players.push(name);
	console.log(players);
	if(players.length < 3)
		serveWaitingMessage(req,res,name);
	else{
		isStarted = true;
		startGame();
		res.end(JSON.stringify({isStarted : true}));
	}
};

var requestForJoining = function(req,res,next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	})
	req.on('end',function(){
		if(players.length >= 3)
			res.end('try after some time');
		else if(isJoined(req,res))
			res.end('already join');
		else
			joinPlayer(req,res,data);
	})
};	
var isPlayer = function(req){
	return players.some(function(player){
		return player == req.headers.cookie;
	});
};
var serveCards = function(req,res){
	var playerHand = playerWithHand.filter(function(player){
		if((req.headers.cookie == player.name) && isPlayer(req))
			return player;
	});
	playerHand ? res.end(JSON.stringify(playerHand[0].hand)) : res.end();
}
var serveUpdate = function(req,res){
	if(isStarted && isPlayer(req)){
		res.end(JSON.stringify({ isStarted : true }));
	}
	else
		res.end();
};
var requestForPlayingCards = function(req,res,next){
	var data = '';
	req.on('data',function(chunk){
		data+=chunk;
	})
	req.on('end',function(){
		if(isPlayer(req)){
			var currentPlayer = playerWithHand.filter(function(player){
				if (player.name == req.headers.cookie)
					return player;
			});
			deckLib.removePlayedCardsFromPlayerHand(currentPlayer[0],JSON.parse(data));
			deckLib.changePlayerTurn(playerWithHand);
		}
		res.end();
	});
};
var findCurrentPlayer = function(req){
	var currentPlayer = playerWithHand.filter(function(player){
				if (player.name == req.headers.cookie)
					return player;
			});
	return currentPlayer[0];
}
var getStatus = function(req,res){
	if(isPlayer(req)){
		serveCards(req,res);
	}
};

var serveTurnMessage = function(req,res){
	if(isPlayer(req)){
		var currentPlayer = findCurrentPlayer(req)
		res.end(JSON.stringify(currentPlayer.isturn))
	}
	res.end();
		
}

exports.post_handlers = [
	{path : '^/joingame$' , handler : requestForJoining},
	{path : '^/html/playCard$' , handler : requestForPlayingCards},
	{path: '', handler: serveStaticFile},
	{path : '',handler : notAllowed}
];

exports.get_handlers = [
	{path: '^/html/serveTurnMessage$',handler:serveTurnMessage},
	{path: '^/$', handler: serveLoginPage},
	{path: '^/update$' , handler:serveUpdate},
	{path: '^/html/getStatus$' , handler:getStatus},
	{path: '^/html/handCards$',handler:serveCards},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];