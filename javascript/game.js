var module = require('./deck.js').lib;
var playerLib = require('./player.js').lib;
var lib = {};
exports.lib = lib;
lib.distributeCardsToPlayersHand = function(cards,player_names){
	var seperatedHands = lib.creatingPlayerHand(cards);
	var playerInfo = [];
	player_names.forEach(function(eachPlayer){
		playerInfo.push(new playerLib.Player(eachPlayer))
	});
	var player_info = playerInfo.map(function(player,index){
		player.hand = seperatedHands[index];
		return player;
	});
	return player_info;
};
lib.creatingPlayerHand = function(cards){
	var allHand=[[],[],[]];
	for (var cardsindex = 0; cardsindex < 17; cardsindex++){
		for (var allHandindex = 0; allHandindex < 3; allHandindex++) {
			allHand[allHandindex].push(cards.pop());
		}
	};
	return allHand;
};

lib.removePlayedCardsFromPlayerHand = function(player,idsOfPlayedCards){
	player.hand = player.hand.filter(function(obj){
		return idsOfPlayedCards.indexOf(obj.id) === -1;
	})
	return player;
};

lib.changePlayerTurn = function(){
	var count = 1;
	return function(players){
		players[(count)-1].isturn = false;
		count = count%3;
		players[count].isturn = true;
		count++;
		return players
	}
}();

lib.isNewRound = function(actionLog){
	var flag = true;
	if(actionLog.length == 0)
		return true;
	else if(actionLog.length<3)
		return false;
	else{
		for (var index = actionLog.length-1 ; index >= actionLog.length -3 ; index--) {
			if(actionLog[index].action != 'pass')
				flag = false;
		};
	}
	return flag;
}
