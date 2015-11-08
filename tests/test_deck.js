var Deck = require('../models/deck.js');
var _ = require('lodash');

module.exports = {
	setUp: function(callback) {
		this.deck = new Deck();
		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that decks are initialized properly
	 */
	test_initial_conditions: function(test) {
		test.ok(this.deck.get('unplayed').length > 0, 'Unplayed should have cards');
		test.ok(_.isEmpty(this.deck.get('discard')), 'Discard pile should be empty');
		test.done();
	},

	test_draw_cards: function(test) {
		var initialLength = this.deck.get('unplayed').length;

		test.equal(this.deck.draw(5).length, 5, 'Should have drawn 5 cards');
		test.equal(this.deck.get('unplayed').length, initialLength - 5, 'Unplayed should have removed 5 cards');
		test.done();
	},

	test_discard: function(test) {
		var card = this.deck.draw(1)[0];
		this.deck.discard(card);

		test.equal(this.deck.get('discard').length, 1, 'Discard should have 1 card');
		test.equal(this.deck.get('discard')[0], card, 'Discard should contain card');
		test.done();
	}
}