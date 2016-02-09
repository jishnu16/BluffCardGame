var Card = function(nameOfCards,suit){
	this.name = nameOfCards;
	this.suit = suit;
	this.id = this.generateCardId(nameOfCards,suit);
};
Card.prototype = {
	generateCardId : function(name,suit){
		return suit[0].toUpperCase() + name;
	}
}
module.exports = Card;