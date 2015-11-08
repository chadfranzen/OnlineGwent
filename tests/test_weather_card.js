var WeatherCard = require('../models/cards/weathercard.js');
var Row = require('../models/row.js');
var Weather = require('../models/weather.js');

module.exports = {
	setUp: function(callback) {
		this.frost = new WeatherCard({
			type: 'WEATHER',
			name: 'Biting Frost',
			range: 'CLOSE'		
		});

		this.clear = new WeatherCard({
			type: 'WEATHER',
			name: 'Clear Weather',
			range: 'ALL'
		})

		Weather.clearWeather();

		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that weather cards activate weather when played
	 */
	test_activate_weather: function(test) {
		Weather.activateWeather(this.frost);
		test.ok(Weather.get('CLOSE'), 'Close range weather should be active');
		test.done();
	},

	/**
	 * Checks that a clear weather card removes weather effects
	 */
	test_clear_weather: function(test) {
		Weather.activateWeather(this.frost);
		Weather.activateWeather(this.clear);
		test.ok(!Weather.get('CLOSE'), 'Close range weather should be clear');
		test.done();
	},


}