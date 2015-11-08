const Backbone = require('Backbone');
const _ = require('lodash');
const Weather = require('../weather.js');

const WeatherCard = Backbone.Model.extend({
	defaults: {
		// The type of this card
		type: 'WEATHER',

		// The name of this card
		name: '',

		// The range of this card; one of (CLOSE, RANGED, SIEGE)
		range: 'CLOSE'
	},

	/**
	 * Sends this card to Weather to be activated, and triggers a 'play' event
	 */
	play() {
		Weather.activateWeather(this);
		this.trigger('play', this);
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		return clone;
	}
});

module.exports = WeatherCard;