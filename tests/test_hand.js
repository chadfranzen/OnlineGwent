var Hand = require('../models/hand.js');
var Player = require('../models/player.js');
var UnitCard = require('../models/cards/unitcard.js');

module.exports = {
	setUp: function(callback) {
		this.player = new Player();
		this.hand = this.player.get('hand');
		this.card = new UnitCard({
			type: 'UNIT',
			name: 'Redanian Foot Soldier',
			range: 'CLOSE',
			baseStrength: 1
		});

		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that hands are initialized with cards
	 */
	test_initial_conditions: function(test) {
		test.equal(this.hand.get('cards').length, 10, 'Hand should start with 10 cards');
		test.done();
	},

	/**
	 * Checks that drawing a hand adds 10 more cards
	 */
	test_draw_hand: function(test) {
		this.hand.drawHand();
		test.equal(this.hand.get('cards').length, 20, 'Hand should have drawn 10 more cards');
		test.done();
	},

	/**
	 * Checks that playing a card in the hand will cause this hand
	 * to remove that card
	 */
	test_card_played: function(test) {
		this.hand.addCard(this.card);
		this.card.play();
		test.equal(this.hand.get('cards').length, 10, 'Hand should have 10 cards');
		test.equal(this.hand.get('cards').indexOf(this.card), -1, 'Card should not be in hand');
		test.done();
	},

	/**
	 * Checks that cards can be added to the hand
	 */
	test_add_card: function(test) {
		this.hand.addCard(this.card);
		test.equal(this.hand.get('cards').length, 11, 'Hand should have 11 cards');
		test.ok(this.hand.get('cards').indexOf(this.card) >= 0, 'Hand should contain new card');
		test.done();
	}
}