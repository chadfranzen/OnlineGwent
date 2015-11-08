const Backbone = require('Backbone');
const _ = require('lodash');

const Scorch = Backbone.Model.extend({
	defaults: {
		type: 'SCORCH',

		name: "Scorch"
	},

	/**
	 * Plays this Scorch. The 'play' event will bubble up
	 */
	play() {
		this.trigger('play', this);
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		return clone;
	}
});

module.exports = Scorch;