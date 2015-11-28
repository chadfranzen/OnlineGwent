const Backbone = require('backbone');
const _ = require('lodash');

const Hand = Backbone.Model.extend({
	defaults: {
		// The list of cards currently in our hand
		cards: null,

		// The deck we're drawing this hand from
		deck: null,

		// The owner of this hand
		owner: null,
	},

	// You should initialize a deck with an owner only
	initialize() {
		const owner = this.get('owner');

		this.set('cards', []);

		this.set('deck', owner.get('deck'));

		this.drawHand();
	},

	/**
	 * Draws a full hand's worth of cards from the deck
	 */
	drawHand() {
		const deck = this.get('deck').draw(10);
		_.each(deck, (card) => this.addCard(card));
	},

	/**
	 * Adds a card to this hand, and sets up even listening for that card
	 * @param {Card} card the card to add
	 */
	addCard(card) {
		card.on('play', this.cardPlayed, this);
		this.get('cards').push(card);
	},

	/**
	 * The handler for when a card in this hand is played
	 * Removes the card from the hand and bubbles the 'play' trigger up
	 * @param  {Card} card the card that is being played
	 */
	cardPlayed(card) {
		const cards = this.get('cards'),
			  index = cards.indexOf(card);

		card.off(null, null, this);
		cards.splice(index, 1);

		// When we play a spy, we draw two cards
		if (card.get('ability') === 'SPY') {
			_.each(this.get('deck').draw(2), (card) => this.addCard(card));
		}

		this.trigger('play', card);
	},

	/**
	 * Returns the first card in this hand that matches the given name
	 * @param  {String} name the name of the card you are searching for
	 * @return {Card}      the card found
	 */
	findCard(name) {
		return _.find(this.get('cards'), (card) => (card.get('name') === name));
	},

	toJSON() {
		var clone = _.clone(this.get('cards'));
		return {
			cards: _.map(clone, (card) => card.toJSON())
		};
	}
});

module.exports = Hand;