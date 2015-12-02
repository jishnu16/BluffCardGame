var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var players = [];
var requestHandler = function  (req,res) {
	console.log('Method',req.method)
	console.log('url ==>',req.url)

	if(req.method == 'GET')
		allGetHandler(req,res);
	else if(req.method == 'POST')
		allPostHandler(req,res);
};

var allGetHandler = function(req,res){
	if(req.url == '/')
		req.url = '/html/login.html';
	var path = './public' + req.url;
	fs.readFile(path,function(err,data){
		if (err){
			res.statusCode = 404;
			res.end('data not found');
		}
		else{
			console.log(req.headers.cookie)
			res.statusCode = 200;
			res.end(data);
		}
	});
};

var allPostHandler = function(req,res){
	var data = '';
	req.on('data',function(chunk){
		data += chunk;
	});
	req.on('end',function(){
		var nameId = querystring.parse(data);
		players.push(nameId.name);
		console.log('players ==>',players)
	})
};

var server = http.createServer(requestHandler);
server.listen(8000);