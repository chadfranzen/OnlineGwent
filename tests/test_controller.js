var GameController = require('../controllers/gamecontroller.js');
var UnitCard = require('../models/cards/unitcard.js');
var Horn = require('../models/cards/horn.js');
var Decoy = require('../models/cards/decoy.js');

module.exports = {
	setUp: function(callback) {
		this.controller = new GameController();
		this.controller.startGame();
		this.game = this.controller.get('game');
		this.player = this.game.get('first'),
		this.rangedRow = this.player.get('field').get('RANGED');

		// Put some cards in player's hand so we have something to test with
		var hand = this.player.get('hand'),
			unitCard = new UnitCard({
				type: 'UNIT',
				name: 'Keira Metz',
				range: 'RANGED',
				baseStrength: 5
			}),
			decoy = new Decoy(),
			horn = new Horn();

		hand.addCard(unitCard);
		hand.addCard(decoy);
		hand.addCard(horn);

		callback();
	},

	tearDown: function(callback) {
		callback();
	},

	/**
	 * Checks that pass moves are executed correctly
	 */
	test_pass: function(test) {
		test.ok(this.controller.makeMove({
			playerId: 'first',
			moveType: 'PASS'
		}), 'Move should have executed');

		test.ok(this.player.get('hasPassed'), 'Player should have passed');
		test.done();
	},

	/**
	 * Checks that playing a standard card is executed correctly
	 */
	test_play_card: function(test) {
		test.ok(this.controller.makeMove({
			playerId: 'first',
			moveType: 'PLAY',
			card: {
				name: 'Keira Metz'
			}
		}), 'Move should have executed');

		test.equal(this.player.getStrength(), 5, 'Card should have been played');
		test.done();
	},

	/**
	 * Checks that playing a horn is executed correctly
	 */
	test_play_horn: function(test) {
		test.ok(this.controller.makeMove({
			playerId: 'first',
			moveType: 'PLAY',
			card: {
				name: "Commander's Horn"
			},
			range: 'RANGED'
		}), 'Move should have executed');

		test.ok(this.rangedRow.get('hornIsActive'), 'Horn should be active');

		test.done();
	},

	/**
	 * Checks that playing a decoy is executed correctly
	 */
	test_play_decoy: function(test) {
		// Put a card on the field for us to decoy
		this.controller.makeMove({
			playerId: 'first',
			moveType: 'PLAY',
			card: {
				name: 'Keira Metz'
			}
		});
		this.controller.makeMove({
			playerId: 'second',
			moveType: 'PASS'
		});

		// Play the decoy
		test.ok(this.controller.makeMove({
			playerId: 'first',
			moveType: 'PLAY',
			card: {
				name: 'Decoy'
			},
			target: {
				name: 'Keira Metz',
				range: 'RANGED'
			}
		}), 'Move should have executed');

		test.ok(this.player.get('hand').findCard('Keira Metz'), 'Card should have been returned to hand');
		test.equal(this.rangedRow.get('cards')[0].get('name'), 'Decoy', 'Decoy should be on field');
		test.done();
	},

	/**
	 * Checks that invalid moves are not executed
	 */
	test_invalid_move: function(test) {
		test.ok(!this.controller.makeMove({
			playerId: 'second'
		}), 'Should not execute if not your turn');

		test.ok(!this.controller.makeMove({
			playerId: 'first',
			moveType: 'JUNK'
		}), 'Should not execute if move type is invalid');

		this.game.set('gameOver', true);
		test.ok(!this.controller.makeMove({
			playerId: 'first',
			moveType: 'PLAY',
			card: {
				name: 'Keira Metz'
			}
		}), 'Should not execute move if game is over');

		test.done();
	},

	/**
	 * Checks that GameControllers correctly construct a relative state
	 */
	test_get_state: function(test) {
		var firstState = this.controller.getStateFor('first'),
			secondState = this.controller.getStateFor('second');

		test.deepEqual(firstState.player, secondState.opponent, 'First player should be second opponent');
		test.deepEqual(secondState.player, firstState.opponent, 'Second player should be first opponent');
		test.done();
	}

};