const Backbone = require('backbone');
const _ = require('lodash');
const Row = require('./row.js');

const Field = Backbone.Model.extend({
	defaults: {
		CLOSE: null,
		RANGED: null,
		SIEGE: null
	},

	initialize: function() {
		var close = new Row({range: 'CLOSE'}),
			ranged = new Row({range: 'RANGED'}),
			siege = new Row({range: 'SIEGE'});

		close.on('remove', this.cardRemoved, this);
		ranged.on('remove', this.cardRemoved, this);
		siege.on('remove', this.cardRemoved, this);

		this.set({
			CLOSE: close,
			RANGED: ranged,
			SIEGE: siege
		});
	},

	/**
	 * @return {Number} the total strength of all cards on this field
	 */
	getStrength() {
		return _.reduce(this.attributes, (sum, n, range) => {
			return sum + this.get(range).getStrength();
		}, 0);
	},

	/**
	 * Returns the maximum strength of any Unit card in this field
	 * Does NOT include hero cards
	 * @return {Number} the max strength
	 */
	getMaxStrength() {
		return Math.max(this.get('CLOSE').getMaxStrength(),
						this.get('RANGED').getMaxStrength(),
						this.get('SIEGE').getMaxStrength());
	},

	/**
	 * Adds a card to this field in the correct position
	 * @param {Card} card the card to add
	 */
	addCard(card) {
		var range = card.get('range');

		if (card.get('type') === 'DECOY') {
			range = card.get('target').get('range');
		}

		this.get(range).addCard(card);
	},

	/**
	 * Clears the entire field
	 */
	clearField() {
		this.get('CLOSE').clearRow();
		this.get('RANGED').clearRow();
		this.get('SIEGE').clearRow();
	},

	/**
	 * Removes any cards in this field whose strength matches the given strength
	 * @param  {Number} strength the strength of cards to remove
	 */
	removeWhere(strength) {
		this.get('CLOSE').removeWhere(strength);
		this.get('RANGED').removeWhere(strength);
		this.get('SIEGE').removeWhere(strength);
	},

	/**
	 * Bubbles up the remove event from rows
	 */
	cardRemoved(card, returnToHand) {
		this.trigger('remove', card, returnToHand);
	},

	toJSON() {
		var clone = _.clone(this.attributes),
			key;

		for (key in clone) {
			if (_.isFunction(clone[key].toJSON)) {
				clone[key] = clone[key].toJSON();
			}
		}

		return clone;
	}
});

module.exports = Field;