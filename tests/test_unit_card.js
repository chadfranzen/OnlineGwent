var UnitCard = require('../models/cards/unitcard.js');
var Row = require('../models/row.js');
var Weather = require('../models/weather.js');

module.exports = {
	setUp: function(callback) {
		this.card = new UnitCard({
			type: 'UNIT',
			name: 'Keira Metz',
			range: 'RANGED',
			baseStrength: 5
		});

		this.otherCard = new UnitCard({
			type: 'UNIT',
			name: 'Sabrina Glevissig',
			range: 'RANGED',
			baseStrength: 4
		});

		this.row = new Row({range: 'RANGED'});
		this.row.addCard(this.card);
		this.row.addCard(this.otherCard);

		Weather.clearWeather();

		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that cards correctly calculate strength in simple situations
	 */
	test_get_strength: function(test) {
		test.equal(this.card.getStrength(), 5, 'Strength should equal base strength to start');
		test.done();
	},

	/**
	 * Checks that strength correctly responds to weather effects
	 */
	test_weather_effect: function(test) {
		Weather.set('RANGED', true);
		test.equal(this.card.getStrength(), 1, 'Strength should be 1 when affected by weather');
		test.done();
	},

	/**
	 * Checks that strength correctly responds to horns
	 */
	test_horn_effect: function(test) {
		this.row.set('hornIsActive', true);
		test.equal(this.card.getStrength(), 10, 'Strength should be doubled when horn is active');
		test.done();
	},

	/**
	 * Checks that morale boost ability modifies strength correctly
	 */
	test_morale_boost: function(test) {
		this.otherCard.set('ability', 'MORALE BOOST');
		test.equal(this.card.getStrength(), 6, 'Strength should have increased by 1');
		test.equal(this.otherCard.getStrength(), 4, 'Morale boost card should not modify own strength');
		test.done();
	},

	/**
	 * Checks that tight bond cards modify strength correctly
	 */
	test_tight_bond: function(test) {
		var firstClone, secondClone;

		this.card.set('ability', 'TIGHT BOND');
		firstClone = this.card.clone();
		secondClone = this.card.clone();

		this.row.addCard(firstClone);
		test.equal(this.card.getStrength(), 10, 'Strength should be doubled');
		this.row.addCard(secondClone);
		test.equal(this.card.getStrength(), 15, 'Strength should be tripled');
		this.row.set('hornIsActive', true);
		test.equal(this.card.getStrength(), 30, 'Strength should be increased before horn takes effect');
		test.done();
	},

	/**
	 * Checks that hero cards are immune to special effects
	 */
	test_hero_card: function(test) {
		this.card.set('ability', 'HERO');

		this.otherCard.set('ability', 'MORALE BOOST');
		test.equal(this.card.getStrength(), 5, 'Hero should be immune to Morale Boost');

		this.row.set('hornIsActive', true);
		test.equal(this.card.getStrength(), 5, 'Hero should be immune to horn effect');

		Weather.set('RANGED', true);
		test.equal(this.card.getStrength(), 5, 'Hero should be immune to weather effect');
		test.done();
	}
}