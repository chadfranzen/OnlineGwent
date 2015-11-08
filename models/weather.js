const Backbone = require('Backbone');
const _ = require('lodash');

const Weather = Backbone.Model.extend({
	defaults: {
		// True if weather is currently active at that range
		CLOSE: false,
		RANGED: false,
		SIEGE: false
	},

	/**
	 * Activates the weather effect for a given weather card
	 * @param  {WeatherCard} card the card to activate
	 */
	activateWeather(card) {
		const range = card.get('range');

		if (range === 'ALL') {
			this.clearWeather();
		} else {
			this.set(range, true);
		}
	},

	/**
	 * Removes all weather effects
	 */
	clearWeather() {
		this.set({
			CLOSE: false,
			RANGED: false,
			SIEGE: false
		});
	}
});

module.exports = new Weather();