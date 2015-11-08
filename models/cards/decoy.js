const Backbone = require('Backbone');
const _ = require('lodash');

const Decoy = Backbone.Model.extend({
	defaults: {
		type: 'DECOY',

		name: "Decoy",

		// The card that this decoy is going to replace
		// MUST be set before playing this card
		target: null,

		// If this decoy is on the field, this will hold the row it is in
		row: null
	},

	/**
	 * Plays this Decoy. The 'play' event will bubble up
	 */
	play() {
		this.trigger('play', this);
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		delete clone.row;
		return clone;
	}
});

module.exports = Decoy;