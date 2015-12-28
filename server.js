var http = require('http');
var Controller = require('./routes.js');
var lib = require('./lib/game.js');
var deck = require('./lib/deck.js')
var Game = lib.Game;
var game = new Game(deck.generateCards());
var controller = new Controller(game);
http.createServer(controller).listen(4444);