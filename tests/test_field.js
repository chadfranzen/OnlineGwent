var Field = require('../models/field.js');
var UnitCard = require('../models/cards/unitcard.js');

module.exports = {
	setUp: function(callback) {
		this.field = new Field();

		this.closeCard = new UnitCard({
			type: 'UNIT',
			name: 'Redanian Foot Soldier',
			range: 'CLOSE',
			baseStrength: 1
		});

		this.siegeCard = new UnitCard({
			type: 'UNIT',
			name: 'Trebuchet',
			range: 'SIEGE',
			baseStrength: 6
		});
		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that a field can add a card to the correct row
	 */
	test_add_card: function(test) {
		this.field.addCard(this.closeCard);
		test.equal(this.field.get('CLOSE').get('cards')[0], this.closeCard, 'Should have been added to close row');
		this.field.addCard(this.siegeCard);
		test.equal(this.field.get('SIEGE').get('cards')[0], this.siegeCard, 'Should have been added to siege row');
		test.done();
	},

	/**
	 * Checks that a field can correctly calculate its total strength
	 */
	test_get_strength: function(test) {
		test.equal(this.field.getStrength(), 0, 'Strength should be 0 when empty');
		this.field.addCard(this.closeCard);
		this.field.addCard(this.siegeCard);
		test.equal(this.field.getStrength(), 7, 'Strength should be calculated correctly');
		test.done();
	},

	/**
	 * Checks that fields correctly find their maximum strength card
	 */
	test_get_max_strength: function(test) {
		this.field.addCard(this.closeCard);
		this.field.addCard(this.siegeCard);
		test.equal(this.field.getMaxStrength(), 6, 'Max strength should be correct');
		this.siegeCard.set('ability', 'HERO');
		test.equal(this.field.getMaxStrength(), 1, 'Hero cards should not be counted in max strength');
		test.done();
	},

	/**
	 * Checks that fields can selectively remove cards
	 */
	test_remove_where: function(test) {
		this.field.addCard(this.closeCard);
		this.field.addCard(this.siegeCard);
		this.field.removeWhere(6);
		test.equal(this.field.getStrength(), 1, 'Should have removed cards with strength 6');
		test.done();
	},

	/**
	 * Checks that fields can clear all their cards
	 */
	test_clear_field: function(test) {
		this.field.addCard(this.closeCard);
		this.field.addCard(this.siegeCard);
		this.field.clearField();
		test.equal(this.field.get('CLOSE').get('cards').length, 0, 'Close row should be empty');
		test.equal(this.field.get('SIEGE').get('cards').length, 0, 'Siege row should be empty');
		test.done();
	},
}