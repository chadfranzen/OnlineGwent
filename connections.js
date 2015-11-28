var Backbone = require('backbone');
var _ = require('lodash');
var GameController = require('./controllers/gamecontroller.js');

var Connections = Backbone.Model.extend({
	// The current game
	gameController: null,

	// The socket associated with the first player of the game
	firstClient: null,

	// The socket associated with the second player of the game
	secondClient: null,


	initialize() {
		_.bindAll(this, 'addClient', 'moveMade', 'closeConnections', 'sendGame');
		this.set('gameController', new GameController);
	},

	/**
	 * Registers a new player connection. If both players are connected, the game will begin
	 * @param {Socket} socket the websocket of the player connecting
	 * @returns true if player successfully connected
	 */
	addClient(socket) {
		var firstClient = this.get('firstClient'),
			secondClient = this.get('secondClient');

		if (!firstClient) {
			socket.emit('id', 'first');
			this.set('firstClient', socket);
		} else if (!secondClient) {
			socket.emit('id', 'second');
			this.set('secondClient', socket);

			// Game is ready to start
			this.get('gameController').startGame();
			this.sendGame();
		} else {
			socket.emit('full');
			return false;
		}

		socket.on('move', this.moveMade);
		socket.on('disconnect', this.closeConnections);

		return true;
	},

	/**
	 * Closes both client connections and effectively
	 * resets this Connections object to its initial state
	 */
	closeConnections() {
		var firstClient = this.get('firstClient'),
			secondClient = this.get('secondClient');

		firstClient && firstClient.disconnect(true);
		secondClient && secondClient.disconnect(true);

		this.set({
			firstClient: null,
			secondClient: null
		});
	},

	/**
	 * When a client sends a move, attempts to execude the move.
	 * Will send the updated game state if successful.
	 * @param  {Move} move the object representing the move
	 */
	moveMade(move) {
		var success = this.get('gameController').makeMove(move);
		if (success) {
			this.sendGame();
		}
	},

	/**
	 * Sends the current state of the game to both clients
	 */
	sendGame() {
		var	gameController = this.get('gameController'),
			firstState = gameController.getStateFor('first'),
			secondState = gameController.getStateFor('second');

		this.get('firstClient').emit('update', firstState);
		this.get('secondClient').emit('update', secondState);
	}
});

module.exports = new Connections();