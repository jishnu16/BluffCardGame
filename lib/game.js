var library = require('./deck.js');
var playerLib = require('./player.js');
var _ = require('lodash');
var Player = playerLib.Player;
var lib = {};
module.exports = lib;


lib.Game = function(pack,gameId){
	this.id = gameId;
	this.players = [];
	this.actionLog = [];
	this.isStarted = false;
	this.namedCard ;
	this.pack = pack;
	this.challengeResult;
}
lib.Game.prototype = {
	getGameId:function(){
		return this.id;
	},
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
			throw(new Error('Try after some time'));
		if(this.isAlreadyJoin(playerName))
			throw(new Error('Already joined'));
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
			throw(new Error('Waiting for other players to join'));

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
		else
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
		this.deleteChallengeResult();
	},
	deal:function(){
		this.pack = _.shuffle(this.pack)
		var players = this.players;
		this.pack.forEach(function(card,index){
			players[index%3].takeCard(card)
		});
	},
	changePlayerTurn:function(){
		var index = _.findIndex(this.players,{isturn : true})
		var indexToBeTrue = (index==2)? 0 :(index+1);
		this.players[index].isturn = false;
		this.players[indexToBeTrue].isturn = true;

	},
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
		var looserName = this.getLastPlayedPlayer().name;
		var result = [];
		result.push(challengerName);
		result.push(looserName);
		if(this.canBluff()){
			if(this.checkRoundCards()){
				result.push(challengerName);
				var challenger = this.findRequestPlayer(challengerName);
				this.takeRoundCards(challenger);
				this.challengeResult = result;
				return;
			}
			else{
				result.push(looserName);
				var looserName = this.getLastPlayedPlayer().name;
				var looserPlayer = this.findRequestPlayer(looserName);
				this.takeRoundCards(looserPlayer);
				this.challengeResult = result;
				return;
			}
		}
	},
	bluffStatus : function(challengerName){
		return this.challengeResult;
	},
	deleteChallengeResult : function(){
		this.challengeResult=[];
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
		return _.findLast(this.actionLog,{action:'played'}).cards;
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
	},
	isGameFinish : function (){
		var emptyHandPlayer = this.getEmptyHandPlayer();
		var lastPlayedPlayer = this.getLastPlayedPlayer();
		if(emptyHandPlayer != undefined && lastPlayedPlayer){
			if(emptyHandPlayer.name != lastPlayedPlayer.name)
				return true;
		}
		else if(this.isNewRound() && this.getEmptyHandPlayer()){
			return true;
		}
		else
			return false;
	},
	getLastPlayedPlayer : function(){
		return _.findLast(this.actionLog,{action:'played'});
	},
	getEmptyHandPlayer : function(){
		return _.find(this.players,function(player){
			return player.hand.length == 0;
		})
	},
	getShortedPlayersByHand : function(){
		return this.players.sort(function(previous,current){
			return previous.hand.length - current.hand.length;
		})
	},
	getPlayerHandCardsLength : function(){
		var shortedPlayers = this.getShortedPlayersByHand();
		var result = [];
		shortedPlayers.forEach(function(player){
			result.push({name:player.name,noOfCards:player.hand.length})
		})
		return result;
	},
	getCardStatus : function(playerName){
		var cardStatus = [];
		var indexOfCurrentPlayer = _.findIndex(this.players,{name:playerName});
		for (var index = 0; index < this.players.length; index++) {
			var player = this.players[indexOfCurrentPlayer];
			cardStatus.push({name:player.name,noOfCards:player.hand.length,isturn:player.isturn});
			indexOfCurrentPlayer = this.getNextPlayerIndex(indexOfCurrentPlayer);
		};
		return cardStatus;
	},
	getNextPlayerIndex:function(currentIndex) {
		if(currentIndex<2)
			return ++currentIndex;
		return 0;
	},
	getPlayerCards : function(playerName){
		var requestedPlayer = this.findRequestPlayer(playerName);
		this.sortPlayerHandByRank(requestedPlayer);
		return requestedPlayer.hand
	},
	sortPlayerHandByRank : function(playerName){
		var swapped;
	    do {
	        swapped = false;
	        for (var index = 0; index < playerName.hand.length - 1; index++) {
	            if (playerName.hand[index].id[1] > playerName.hand[index + 1].id[1]) {
	                var temp = playerName.hand[index];
	                playerName.hand[index] = playerName.hand[index + 1];
	                playerName.hand[index + 1] = temp;
	                swapped = true;
	            }
	        }
	    } while (swapped);
	}
}
