const Backbone = require('backbone');
const _ = require('lodash');
const Player = require('./player.js');
const Weather = require('./weather.js');

const Game = Backbone.Model.extend({
	default: {
		// the first player
		first: null,

		// the second player
		second: null,

		// if the match is over, this holds the player who won, or null if a tie
		winner: null,

		// true if the match is over
		gameOver: false,

		// the player whose turn it is
		activePlayer: null,
	},

	initialize() {
		const first = new Player(),
			  second = new Player();

		// Set up players
		first.set('opponent', second);
		second.set('opponent', first);


		first.on('play', this.cardPlayed, this);
		first.on('play', this.moveMade, this);
		first.on('pass', this.moveMade, this);
		second.on('play', this.cardPlayed, this);
		second.on('play', this.moveMade, this);
		second.on('pass', this.moveMade, this);

		this.set('first', first);
		this.set('second', second);

		this.set('activePlayer', first);
	},

	/**
	 * Triggered whenever a card is played.
	 * Switches the turn, and takes care of any special
	 * cards that need to be activated.
	 * @param  {Player} player the player who played the card
	 * @param  {Card} card   the card that was just played
	 */
	cardPlayed(player, card) {
		// Nothing for now!
	},

	/**
	 * Triggered whenever a move is made (i.e. card played or pass)
	 * @param  {Player} player  the player who made the move
	 */
	moveMade(player) {
		this.set('activePlayer', player.get('opponent'));
		this.checkForRoundEnd();
	},

	/**
	 * Checks to see if the round has ended
	 * If so, sets up the next round and also calls checkForMatchOver
	 */
	checkForRoundEnd() {
		var first = this.get('first'),
			second = this.get('second'),
			bothPlayersPassed = (
			  						first.get('hasPassed') &&
			  						second.get('hasPassed')
			  					);

		if (bothPlayersPassed) {
			var firstStrength = first.getStrength(),
				secondStrength = second.getStrength(),
				isTie = (firstStrength == secondStrength),
				winner;

			// Figure out who won the round
			if (isTie) {
				winner = null;
			} else {
				winner = firstStrength > secondStrength ? first : second;
			}

			first.endRound(winner == first);
			second.endRound(winner == second);

			this.checkForMatchOver();
		}
	},

	/**
	 * Checks to see if the match is ended (i.e. one player is out of lives)
	 * If so, sets gameOver and winner accordingly
	 */
	checkForMatchOver() {
		var first = this.get('first'),
			second = this.get('second'),
			firstLives = first.get('lives'),
			secondLives = second.get('lives'),
			isTie = (firstLives === secondLives);

		if (firstLives === 0 || secondLives === 0) {
			this.set('gameOver', true);
			if (!isTie) {
				this.set('winner', firstLives > secondLives ? first : second);
			}
		}
	},

	toJSON() {
		var clone = _.clone(this.attributes);
		return {
			first: clone.first.toJSON(),
			second: clone.second.toJSON(),
			winner: clone.winner && ((clone.winner === clone.first) ? 'first' : 'second'),
			gameOver: clone.gameOver,
			activePlayer: (clone.activePlayer === clone.first) ? 'first' : 'second'
		};
	}
});

module.exports = Game;