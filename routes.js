var fs = require('fs');
var querystring = require('querystring');
var players = [];
var isStarted = false;

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
	res.writeHead(200 ,{'Set-Cookie': name});
	players.push(name);
	console.log(players);
	if(players.length < 3)
		serveWaitingMessage(req,res,name);
	else{
		isStarted = true;
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
	})
};
var serveUpdate = function(req,res){
	if(isStarted && isPlayer(req))
		res.end(JSON.stringify({ isStarted : true }));
	else
		res.end();
};


exports.post_handlers = [
	{path : '^/joingame$' , handler : requestForJoining},
	{path: '', handler: serveStaticFile},
	{path : '',handler : notAllowed}
];


exports.get_handlers = [
	{path: '^/$', handler: serveLoginPage},
	{path: '^/update$' , handler:serveUpdate},
	{path: '', handler: serveStaticFile},
	{path: '', handler: fileNotFound}
];