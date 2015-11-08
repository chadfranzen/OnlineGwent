const Backbone = require('Backbone');
const _ = require('lodash');
const UnitCards = require('../data/unitcards.js');
const SpecialCards = require('../data/specialcards.js');
const UnitCard = require('./cards/unitcard.js');
const WeatherCard = require('./cards/weathercard.js');
const Horn = require('./cards/horn.js');
const Scorch = require('./cards/scorch.js');
const Decoy = require('./cards/decoy.js');

const Deck = Backbone.Model.extend({
	defaults: {
		// Array of Cards that have not been played yet
		unplayed: null,

		// Array of Cards that have already been played and discarded
		discard: null,

	},

	/**
	 * Loads a default set of cards
	 */
	initialize() {
		var deckData = this.selectDeck();

		var unplayed = _.map(deckData, (cardData) => {

			// Determine which card class to instantiate
			// based on the type in our data
			switch (cardData.type) {
				case 'UNIT':
					return new UnitCard(cardData);
				case 'WEATHER':
					return new WeatherCard(cardData);
				case 'HORN':
					return new Horn(cardData);
				case 'SCORCH':
					return new Scorch(cardData);
				case 'DECOY':
					return new Decoy(cardData);
			}
		});

		this.set('unplayed', _.shuffle(unplayed));
		this.set('discard', []);
	},

	/**
	 * Randomly selects a deck of 22 unit cards and 10 special cards
	 * @return {Array} the data for the 32-card deck
	 */
	selectDeck() {
		var unitCardData = _.shuffle(UnitCards).slice(0, 22),
			specialCardData = _.shuffle(SpecialCards).slice(0, 10),
			cardData = unitCardData.concat(specialCardData);

		return _.shuffle(cardData);
	},

	/**
	 * Draws a variable number of cards from the unplayed pile
	 * @param  {Number} cardCount the number of cards to draw
	 * @return {Array}            a list of Cards
	 */
	draw(cardCount) {
		var cards = [],
			unplayed = this.get('unplayed');

		// Remove cards from unplayed and push them into our return array
		_.times(cardCount, () => {
			if (!_.isEmpty(unplayed)) {
				cards.push(unplayed.pop());
			}
		});

		return cards;
	},

	/**
	 * Adds a card to the discard pile
	 * @param  {Card} card the card to discard
	 */
	discard(card) {
		this.get('discard').push(card);
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		clone.unplayed = _.map(clone.unplayed, card => card.toJSON());
		clone.discard = _.map(clone.discard, card => card.toJSON());
		return clone;
	}
});

module.exports = Deck;