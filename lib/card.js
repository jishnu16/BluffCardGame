var Card = function(nameOfCards,suit){
	this.name = nameOfCards;
	this.suit = suit;
	this.id = this.generateCardId(nameOfCards,suit);
};
Card.prototype = {
	generateCardId : function(name,suit){
		if(typeof(name) == 'string')
			return suit[0].toUpperCase() + name[0].toUpperCase();
		return suit[0].toUpperCase() + name;
	}
}
module.exports = Card;