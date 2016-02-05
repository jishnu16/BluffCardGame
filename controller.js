var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var app = express();

app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
	var games = req.games;
	req.game = games.loadGame(req);
	next();
})
app.get('/update',function(req,res){
	res.send(JSON.stringify({isStarted : req.game.isGameStarted()}));
})
var serveCards = function(req,res){
	var playerName = req.cookies.cookieName.name;
	try{
		res.send(JSON.stringify(req.game.getPlayerCards(playerName)));
	}
	catch(err){
		res.send(err.message);
	}
};
app.get('/getStatus',function(req,res){
	var requestedPlayerName = req.cookies.cookieName.name;
	if(req.game.isPlayer(requestedPlayerName))
		serveCards(req,res);
})

app.get('/logout',function(req,res){
	res.clearCookie('cookieName');
	res.end();
})

app.get('/handCards',function(req,res){
	serveCards(req,res);
})
app.get('/tableData',function(req,res){
	var requestedPlayerName = req.cookies.cookieName.name;
	if(req.game.isPlayer(requestedPlayerName))
		res.send(JSON.stringify(req.game.actionLog));
})
app.get('/result',function(req,res){
	// var id = req.cookies.cookieName.gameId;
	// var intervel = setTimeout(req.games.romeveGame(id),5000);
	res.send(JSON.stringify(req.game.getPlayerHandCardsLength()));
})
var serveGameStatus = function(req,res){
	var requestedPlayerName = req.cookies.cookieName.name;
	try{
		var requestedPlayer = req.game.findRequestPlayer(requestedPlayerName);
		var currentPlayer = req.game.getCurrentPlayer();
		var gameStatus = {
			isTurn:requestedPlayer.isturn ,
			name:currentPlayer.name ,
			isNewRound:req.game.isNewRound(),
			namedCard:req.game.namedCard,
			isGameEnded : req.game.isGameFinish(),
		};
		res.send(JSON.stringify(gameStatus));
	}
	catch(err){
		res.send(err.message);
	};
};
app.get('/serveGameStatus',function(req,res){
	serveGameStatus(req,res);
});
app.get('/getCardStatus',function(req,res){
	var requestedPlayerName = req.cookies.cookieName.name;
	var cardStatus = req.game.getCardStatus(requestedPlayerName);
	res.send(JSON.stringify(cardStatus));
})

app.get('/getChallengeStatus',function(req,res){
	var requestedPlayerName = req.cookies.name;
	var challengeStatus = req.game.bluffStatus();
	res.send(JSON.stringify(challengeStatus));
})
app.post('/pass',function(req,res){
	var player = req.cookies.cookieName.name;
	req.game.changeTurnAfterPass(player);
	res.end();
})
app.post('/playCard',function(req,res){
	var cardIds = req.body.cards;
	var requestedPlayerName = req.cookies.cookieName.name;
	req.game.getPlayedCards(cardIds,requestedPlayerName);
	res.end();
})
app.post('/bluff',function(req,res){
	var challengerName = req.cookies.cookieName.name;
	req.game.decideBluff(challengerName);
	res.end();
})
app.post('/setNamedCard',function(req,res){
	var requestedPlayerName = req.cookies.cookieName.name;
	if(req.game.isPlayer(requestedPlayerName) && req.game.isNewRound()){
		req.game.setNameCard(req.body.setCard);
	};
	res.end();
})
var joinPlayer = function(req,res,playerName){
	res.cookie('cookieName',{'name':playerName,'gameId':req.game.getGameId()});
	try{
		req.game.joinPlayer(playerName);
		res.send(JSON.stringify({isStarted : req.game.startGame()}));
	}
	catch(err) {
		res.send(err.message);
	}
};
app.post('/joingame',function(req,res){
	var player = req.body.name;
	joinPlayer(req,res,player)
})

var Controller=function(games) {
	return function(req,res){
		req.games = games;
		app(req,res);
	}
}
module.exports = Controller;
