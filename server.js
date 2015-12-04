var http = require('http');
var routes = require('./routes.js');
var EventEmitter = require('events').EventEmitter;
var Emitter = new EventEmitter();
var get_handlers = routes.get_handlers;
var post_handlers = routes.post_handlers;

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
	console.log('getHandlers ===>',handlers.map(function(ph){
		return ph.path;
	}));
	var next = function(){
		Emitter.emit('next',handlers,req,res,next);
	}
	next();
};

var allPostHandler = function(req,res){
	var handlers = post_handlers.filter(matchHandler(req.url));
	console.log('postHandlers===>',handlers.map(function(ph){
		return ph.path;
	}));
	var next = function(){
		Emitter.emit('next',handlers,req,res,next);
	};
	next();
};

var requestHandler = function  (req,res) {
	console.log('Method==>',req.method)
	console.log('url ==>',req.url)
	if(req.method == 'GET')
		allGetHandler(req,res);
	else if(req.method == 'POST')
		allPostHandler(req,res);
};

var server = http.createServer(requestHandler);
server.listen(8000);