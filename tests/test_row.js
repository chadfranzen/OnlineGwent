var _ = require('lodash');
var Row = require('../models/row.js');
var UnitCard = require('../models/cards/unitcard.js');
var Weather = require('../models/weather.js');
var Horn = require('../models/cards/horn.js');
var Decoy = require('../models/cards/decoy.js');

module.exports = {
	setUp: function(callback) {
		this.row = new Row({
			range: 'RANGED'
		});

		this.firstCard = new UnitCard({
			type: 'UNIT',
			name: 'Redanian Foot Soldier',
			range: 'RANGED',
			baseStrength: 1
		});

		this.secondCard = new UnitCard({
			type: 'UNIT',
			name: 'Keira Metz',
			range: 'RANGED',
			baseStrength: 5
		});

		this.horn = new Horn({
			range: 'RANGED'
		});

		callback();
	},

	tearDown: function(callback) {
		Weather.clearWeather();
		callback();
	},

	/**
	 * Checks that cards are correctly added
	 */
	test_add_card: function(test) {
		this.row.addCard(this.firstCard);
		test.equal(this.row.get('cards')[0], this.firstCard, 'Card should have been added');
		test.equal(this.firstCard.get('row'), this.row, 'Card row should have been updated');
		test.done();
	},

	/**
	 * Checks that decoys replace their target when added
	 */
	test_add_decoy: function(test) {
		var decoy = new Decoy({target: this.firstCard});
		this.row.addCard(this.firstCard);
		this.row.addCard(decoy);
		test.equal(this.firstCard.get('row'), null, 'Target card should have been removed');
		test.equal(decoy.get('row'), this.row, 'Decoy row should have been updated');
		test.equal(this.row.get('cards')[0], decoy, 'Decoy should be added');
		test.done();
	},

	/**
	 * Checks that adding a horn card works correctly
	 */
	test_add_horn: function(test) {
		this.row.addCard(this.horn);
		test.ok(this.row.get('hornIsActive'), 'Horn should be active');
		test.ok(_.isEmpty(this.row.get('cards')), 'Horn should not appear in cards list');
		test.done();
	},

	/**
	 * Checks that total strength is correctly calculated
	 */
	test_get_strength: function(test) {
		test.equal(this.row.getStrength(), 0, 'Strength should be 0 when empty');
		this.row.addCard(this.firstCard);
		this.row.addCard(this.secondCard);
		test.equal(this.row.getStrength(), 6, 'Total strength should be correct');
		test.done();
	},

	/**
	 * Checks that rows can identify their maximum strength card
	 */
	test_get_max_strength: function(test) {
		this.row.addCard(this.firstCard);
		this.row.addCard(this.secondCard);
		test.equal(this.row.getMaxStrength(), 5, 'Should select maximum strength');
		this.secondCard.set('ability', 'HERO');
		test.equal(this.row.getMaxStrength(), 1, 'Should ignore hero cards');
		test.done();
	},

	/**
	 * Checks that rows correctly recognize when weather is active
	 */
	test_weather: function(test) {
		test.ok(!this.row.weatherIsActive(), 'Weather should not be active');
		Weather.set('RANGED', true);
		test.ok(this.row.weatherIsActive(), 'Weather should be active');
		test.done();
	},

	/**
	 * Checks that cards can be removed
	 */
	test_remove: function(test) {
		this.row.addCard(this.firstCard);
		this.row.removeCard(this.firstCard);
		test.equal(this.row.get('cards').length, 0, 'Card should have been removed');
		test.equal(this.firstCard.get('row'), null, 'Card should not have a row');
		test.done();
	},

	/**
	 * Checks that rows can selectively remove cards
	 */
	test_remove_where: function(test) {
		this.row.addCard(this.firstCard);
		this.row.addCard(this.secondCard);
		this.row.removeWhere(5);
		test.equal(this.row.getStrength(), 1, 'Should have removed card with strength 5');
		this.row.addCard(this.secondCard);
		this.secondCard.set('ability', 'HERO');
		this.row.removeWhere(5);
		test.equal(this.row.getStrength(), 6, 'Should not remove hero cards');
		test.done();
	},

	/**
	 * Checks that rows are properly cleared
	 */
	test_clear_row: function(test) {
		this.row.addCard(this.firstCard);
		this.row.addCard(this.secondCard);
		this.row.clearRow();
		test.equal(this.row.get('cards').length, 0, 'Row should be empty');
		test.done();
	}
}