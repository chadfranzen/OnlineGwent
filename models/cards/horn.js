const Backbone = require('backbone');
const _ = require('lodash');

const Horn = Backbone.Model.extend({
	defaults: {
		// The type of this card
		type: 'HORN',

		// The name of this card
		name: "Commander's Horn",

		// The range that this horn is targeting. This is initially null
		// but MUST be set before playing the card.
		range: null
	},

	/**
	 * Plays this horn. The 'play' event will bubble up
	 */
	play() {
		this.trigger('play', this);
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		return clone;
	}
});

module.exports = Horn;