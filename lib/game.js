var library = require('./deck.js');
var playerLib = require('./player.js');
var _ = require('lodash');
var Player = playerLib.Player;
var lib = {};
module.exports = lib;


lib.Game = function(pack){
	this.players = [];
	this.actionLog = [];
	this.isStarted = false;
	this.namedCard ; 
	this.pack = pack;
	
}
lib.Game.prototype = {
	hasVacancy : function(){
		return this.players.length < 3;
	},
	isAlreadyJoin : function(playerName){
		return this.players.some(function(player){
			return player.name == playerName;
		});
	},
	joinPlayer : function(playerName){
		if(!this.hasVacancy())
			throw(new Error('try after some time'));
		if(this.isAlreadyJoin(playerName))
			throw(new Error('already joined'));
		this.players.push(new Player(playerName));
	},
	getCurrentPlayer : function(){
		if(!this.isStarted)
			throw(new Error('game not yet started'));
			
		return this.players.filter(function(player){
			return player.isturn == true;
		})[0];
	},
	startGame : function(){		
		if(this.hasVacancy())
			throw(new Error('waiting for other players to join'));

		this.initializePlayerTurn();		
		this.isStarted = true;
		this.deal();
		return this.isStarted;
	},
	initializePlayerTurn : function(){
		this.players[0].isturn = true;
	},
	findRequestPlayer : function(playerName){ 	
		var player = _.find(this.players,{name:playerName});
		if(player)
			return player;
		throw new Error('player not found');
	},
	isGameStarted:function(){
		return this.isStarted;
	},
	isPlayer : function(playerName){ 			
		return this.players.some(function(player){
			return player.name == playerName;
		});
	},
	setNameCard : function(card){
		this.namedCard = card;
	},
	deal:function(){
		this.pack = _.shuffle(this.pack)
		var players = this.players;
		this.pack.forEach(function(card,index){
			players[index%3].takeCard(card)
		});
	},
	changePlayerTurn:function(){
		var count = 1;
		return function(){
			this.players[count-1].isturn = false;
			count = count%3;
			this.players[count].isturn = true;
			count++;
		}
	}(),
	isNewRound:function(){
		if(this.actionLog.length == 0)
			return true;
		else if(this.actionLog.length<3)
			return false;
		else{
			for (var index = this.actionLog.length-1 ; index >= this.actionLog.length -3 ; index--) {
				if(this.actionLog[index].action != 'pass')
					return false;
			};
		}
		return true;
	},
	updateActionLog : function(action){
		this.actionLog.push(action);
	},
	deleteActionlog : function(){
		this.actionLog = [];
	},
	getActionLog : function(){
		return this.actionLog;
	},
	getPlayedCards : function(playedCardIds,playerName){
		var cardsBucket=[];
		var pack = this.pack;
		playedCardIds.forEach(function(cardId){
			cardsBucket.push(_.find(pack,{id:cardId}))
		});
		var player = this.findRequestPlayer(playerName);
		player.playCards(playedCardIds);
		this.updateActionLog({name:player.name,action:'played',cards:cardsBucket});
		this.changePlayerTurn();
	},
	decideBluff : function(challengerName){
		if(this.canBluff()){
			if(this.checkRoundCards()){
				var challenger = this.findRequestPlayer(challengerName);
				this.takeRoundCards(challenger);
				return;
			}
			else{
				var looserName = this.actionLog[this.actionLog.length-1].name;
				var looserPlayer = this.findRequestPlayer(looserName);
				this.takeRoundCards(looserPlayer);
				return;
			}
		}
	},
	takeRoundCards : function(player){
		var playedCards = this.getAllPlayedCards();
		playedCards.forEach(function(card){
			player.takeCard(card);
		})
		this.deleteActionlog();
	},
	getAllPlayedCards : function(){
		var allCards = [];
		this.actionLog.forEach(function(eachAction){
			if(eachAction.cards)
				allCards.push(eachAction.cards)
		});
		allCards = _.flattenDeep(allCards);
		return allCards;
	},
	canBluff : function(){
		return this.actionLog.length>0;
	},
	getLastPlayedCards : function(){
		return this.actionLog.length>1 ? this.actionLog[this.actionLog.length-1].cards : this.actionLog[0].cards;
	},
	checkRoundCards : function(){
		var lastRoundCards = this.getLastPlayedCards();
		var namedCard = this.namedCard;
		return lastRoundCards.every(function(singleCard){
			return singleCard.name == namedCard;
		});
	},
	changeTurnAfterPass : function(playerName){
		this.updateActionLog({name:playerName,action:'pass'});
		this.changePlayerTurn();
		if(this.isNewRound())
			this.deleteActionlog();
	}
}

