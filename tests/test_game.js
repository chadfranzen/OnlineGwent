var Game = require('../models/game.js');
var UnitCard = require('../models/cards/unitcard.js');

module.exports = {
	setUp: function(callback) {
		this.game = new Game();
		this.first = this.game.get('first');
		this.second = this.game.get('second');

		this.closeCard = new UnitCard({
			type: 'UNIT',
			name: 'Redanian Foot Soldier',
			range: 'CLOSE',
			baseStrength: 1
		});

		this.rangedCard = new UnitCard({
			type: 'UNIT',
			name: 'Dethmold',
			range: 'RANGED',
			baseStrength: 6
		});

		this.siegeCard = new UnitCard({
			type: 'UNIT',
			name: 'Ballista',
			range: 'SIEGE',
			baseStrength: 6
		});

		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that making a move will swap the active player
	 */
	test_move_made: function(test) {
		this.game.moveMade(this.first);
		test.equals(this.game.get('activePlayer'), this.second, 'Active player should have changed');
		test.done();
	},

	/**
	 * Checks that the game correctly recognizes when a round ends
	 */
	test_round_end: function(test) {
		this.first.cardPlayed(this.closeCard);
		this.second.cardPlayed(this.rangedCard);
		this.first.pass();
		this.second.pass();

		test.equals(this.first.get('lives'), 1, 'First player should have lost round');
		test.done();
	},

	/**
	 * Checks that both players lose a life when a round ends in a tie
	 */
	test_tie_round: function(test) {
		this.first.cardPlayed(this.closeCard);
		this.second.cardPlayed(this.closeCard);
		this.first.pass();
		this.second.pass();

		test.equals(this.first.get('lives'), 1, 'First player should have lost a life');
		test.equals(this.second.get('lives'), 1, 'Second player should have lost a life');
		test.done();
	},

	/**
	 * Checks the the game correctly recognizes when the game ends
	 */
	test_game_end: function(test) {
		// Round one
		this.first.cardPlayed(this.rangedCard);
		this.second.cardPlayed(this.closeCard);
		this.first.pass();
		this.second.pass();

		// Round two
		this.first.cardPlayed(this.rangedCard);
		this.second.cardPlayed(this.closeCard);
		this.first.pass();
		this.second.pass();

		test.ok(this.game.get('gameOver'), 'Game should have ended');
		test.equals(this.game.get('winner'), this.first, 'First player should have won');
		test.done();
	},

	/**
	 * Checks that the game correctly recognizes when it ends in a tie
	 */
	test_tie_game: function(test) {
		// Round one
		this.first.cardPlayed(this.closeCard);
		this.second.cardPlayed(this.closeCard);
		this.first.pass();
		this.second.pass();

		// Round two
		this.first.cardPlayed(this.closeCard);
		this.second.cardPlayed(this.closeCard);
		this.first.pass();
		this.second.pass();

		test.ok(this.game.get('gameOver'), 'Game should have ended');
		test.equals(this.game.get('winner'), null, 'Game should not have winner');
		test.done();
	}
}