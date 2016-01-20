var http = require('http');
var Controller = require('./controller.js');
var lib = require('./lib/games.js');
var Games = lib.Games;
var games = new Games();
console.log(games);
var controller = new Controller(games);
http.createServer(controller).listen(4444);	