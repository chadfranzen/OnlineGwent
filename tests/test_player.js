var Player = require('../models/player.js');
var UnitCard = require('../models/cards/unitcard.js');
var Scorch = require('../models/cards/scorch.js');

module.exports = {
	setUp: function(callback) {
		this.player = new Player();
		this.field = this.player.get('field');
		this.opponent = new Player();
		this.opponentField = this.opponent.get('field');
		this.player.set('opponent', this.opponent);
		this.opponent.set('opponent', this.player);
		this.card = new UnitCard({
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
	 * Checks that Player total strength is correct
	 */
	test_get_strength: function(test) {
		this.field.addCard(this.card);
		test.equals(this.player.getStrength(), 6, 'Strength should be correct');
		test.done();
	},

	/**
	 * Checks that cards are correctly added to the field when played
	 */
	test_card_played: function(test) {
		this.player.cardPlayed(this.card);
		test.equals(this.card.get('row'), this.field.get('SIEGE'), 'Card should be added to field');
		test.done();
	},

	/**
	 * Checks that spies are added to opponent's field
	 */
	test_spy_played: function(test) {
		this.card.set('ability', 'SPY');
		this.player.cardPlayed(this.card);
		test.equals(this.player.getStrength(), 0, 'Player should not have any cards');
		test.equals(this.opponent.getStrength(), 6, 'Card should have been added to opponent');
		test.done();
	},

	/**
	 * Checks that scorch affects both player's field and opponent's field
	 */
	test_scorch_played: function(test) {
		var clone = this.card.clone(),
			weakClone = this.card.clone();

		weakClone.set('baseStrength', 5);
		this.player.cardPlayed(this.card);
		this.player.cardPlayed(weakClone);
		this.opponent.cardPlayed(clone);

		this.player.cardPlayed(new Scorch());
		test.equals(this.player.getStrength(), 5, 'Strongest card should have been removed from player');
		test.equals(this.opponent.getStrength(), 0, 'Strongest card should have been removed from opponent');
		test.done();
	},

	/**
	 * Checks that cards are correctly discarded when removed from the field
	 */
	test_card_removed: function(test) {
		this.player.cardRemoved(this.card);
		test.equals(this.player.get('deck').get('discard')[0], this.card, 'Card should have been discarded');
		test.done();
	},

	/**
	 * Checks that removed cards are added back to hand when the returnToHand flag is set
	 */
	test_return_to_hand: function(test) {
		this.player.get('hand').set('cards', []);
		this.player.cardRemoved(this.card, true);
		test.equals(this.player.get('hand').get('cards')[0], this.card, 'Card should have been returned to hand');
		test.done();
	},

	/**
	 * Checks that the correct actions are taken on round end
	 */
	test_end_round: function(test) {
		this.field.addCard(this.card);
		this.player.endRound(false);
		test.equals(this.player.get('lives'), 1, 'Should have lost a life');
		test.equals(this.field.getStrength(), 0, 'Field should be empty');
		test.ok(this.player.get('deck').get('discard').length > 0, 'Card should be in discard');
		test.done();
	}
}