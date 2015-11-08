var Backbone = require('backbone');
var Game = require('../models/game.js');

/**
 * Valid moves:
 *
 * {
 * 	playerId: <playerId>,
 * 	moveType: 'PASS'
 * }
 *
 *
 * 
 * {
 * 	playerId: <playerId>,
 * 	moveType: 'PLAY'
 * 	card: {
 * 		name: <name of card>,
 * 	},
 * 	target: {
 * 		name: <name of card>,
 * 		range: <range of card>
 * 	}
 *  
 *  
 *  {
 * 	playerId: <playerId>,
 * 	moveType: 'PLAY'
 * 	card: {
 * 		name: <name of card>,
 * 	},
 * 	range: <range>
 * }
 */

var GameController = Backbone.Model.extend({
	defaults: {
		// The game instance this is controlling
		game: null
	},

	/**
	 * Starts a new game
	 */
	startGame() {
		this.set('game', new Game());
	},

	/**
	 * Executes a move in the current game
	 * @param  {Move} move an object describing the move
	 * @return {Boolean}   true if the move was valid and was executed
	 */
	makeMove(move) {
		var game = this.get('game'),
			moveType = move.moveType,
			player = game.get(move.playerId);

		// If game is over or it's not this player's turn, ignore this request
		if (player !== game.get('activePlayer') ||
			game.get('gameOver')) {
			return false;
		}

		if (moveType === 'PASS') {
			player.pass();
			return true;
		} else if (moveType === 'PLAY') {
			cardToPlay = this.playCard(move);
			return true;
		} else {
			// This isn't a valid move
			return false;
		}
	},

	/**
	 * Given a move that represents a player playing a card,
	 * executes the move on the game
	 * @param  {Move} move the card move
	 */
	playCard(move) {
		var player = this.get('game').get(move.playerId),
			cardName = move.card.name,
			cardToPlay = player.get('hand').findCard(cardName),
			targetCard, targetName, targetRange;

		// This is a horn card and we need to set a range
		if (move.range) {
			cardToPlay.set('range', move.range);
		}
		// This is a decoy card and we need to set a target
		if (move.target) {
			targetRange = move.target.range;
			targetName = move.target.name;
			targetCard = player.get('field').get(targetRange).findCard(targetName);
			cardToPlay.set('target', targetCard);
		}
		
		cardToPlay.play();
	},

	/**
	 * @param  {String} playerId either 'first' or 'second'
	 * @return a JSON object representing the current game state
	 * from the perspective of playerId
	 */
	getStateFor(playerId) {
		var state = this.get('game').toJSON();
		
		// Rename keys so that they are from the perspective of this player
		if (playerId === 'first') {
			state.player = state.first;
			state.opponent = state.second;
		} else {
			state.player = state.second;
			state.opponent = state.first;
		}

		delete state.first;
		delete state.second;

		return state;
	}
});

module.exports = GameController;