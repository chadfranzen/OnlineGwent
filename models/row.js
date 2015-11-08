const Backbone = require('backbone');
const _ = require('lodash');
const Weather = require('./weather.js');

const Row = Backbone.Model.extend({
	defaults: {
		// An array of the Cards in this row
		cards: null,

		// The range of this row: one of (CLOSE, RANGED, SIEGE)
		range: 'CLOSE',

		// True if there is currently a Commander's Horn affecting this row
		hornIsActive: false,
	},

	// Pass in a range when creating
	initialize() {
		this.set('cards', []);
	},

	/**
	 * @return {Boolean} true if weather is currently affecting this row
	 */
	weatherIsActive() {
		return Weather.get(this.get('range'));
	},

	/**
	 * @return {Number} the total strength of all cards in this row
	 */
	getStrength() {
		const cards = this.get('cards');

		if (_.isEmpty(cards)) {
			return 0;
		}

		return _.reduce(cards, (sum, card) => sum + card.getStrength(), 0);
	},

	/**
	 * @return {Number} the maximum strength of any non-hero unit card in this row
	 */
	getMaxStrength() { 
		return _.max(_.map(this.get('cards'), (card) => {
			var strength = card.getStrength();

			if (!strength || card.get('ability') === 'HERO') {
				return 0;
			}
			return strength;
		}));
	},

	/**
	 * Adds a card into this row
	 * @param {Card} card the card to add
	 */
	addCard(card) {
		const type = card.get('type');

		if (type === 'HORN') {
			this.set('hornIsActive', true);
		} else {
			// If decoy, swap with its target card
			if (type === 'DECOY') {
				this.removeCard(card.get('target'), true);
			}

			this.get('cards').push(card);
			card.set('row', this);
		}
	},

	/**
	 * Returns the first card in this row that matches the given name
	 * @param  {String} name the name of the card you are searching for
	 * @return {Card}      the card found
	 */
	findCard(name) {
		return _.find(this.get('cards'), (card) => (card.get('name') === name));
	},


	/**
	 * Removes all cards from this row.
	 * Also clears a commander's horn, if active.
	 * @return {Array} an array of the cards removed
	 */
	clearRow() {
		_.each(_.clone(this.get('cards')), (card) => {
			this.removeCard(card);
		});
		this.set('hornIsActive', false);
	},

	/**
	 * Removes all non-hero cards from this row whose strength matches the provided strength
	 * @param  {Number} strength the strength of cards to remove
	 */
	removeWhere(strength) {
		_.each(_.clone(this.get('cards')), (card) => {
			if (card.getStrength() === strength &&
				card.get('ability') !== 'HERO') {
				this.removeCard(card);
			}
		});
	},

	/**
	 * Removes the given card from the row, and triggers a remove event
	 * @param  {Card} card the card to remove
	 * @param  {boolean} returnToHand true if this card should be returned to the player's hand
	 *                                instead of being discarded
	 */
	removeCard(card, returnToHand) {
		var cards = this.get('cards'),
			index = cards.indexOf(card);

		cards.splice(index, 1);
		card.set('row', null);
		this.trigger('remove', card, returnToHand);
	}
});

module.exports = Row;