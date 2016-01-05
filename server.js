var http = require('http');
var Controller = require('./controller.js');
var lib = require('./lib/game.js');
var deck = require('./lib/deck.js');
var Deck = deck.Deck;
var Game = lib.Game;
var game = new Game(new Deck().pack);
var controller = new Controller(game);
http.createServer(controller).listen(4444);