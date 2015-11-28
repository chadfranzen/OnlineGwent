import React from 'react';
import ReactDOM from 'react';
import Sidebar from './sidebar.js';
import Hand from './hand.js';
import Board from './board.js'
import io from 'socket.io-client';

const Game = React.createClass({
	getInitialState() {
		return {
			// The unique ID given to us by the server. We need to send this when we make moves.
			playerId: '',

			// True if it is currently our turn
			activePlayer: false,

			// Data about this user
			player: {},

			// Data about our opponent
			opponent: {},

			// If there is a winner, the ID of the winner will be held here
			winner: '',

			// True if the game has ended
			gameOver: false,

			// The current move we are planning on executing
			move: {},

			// When set, will display the text in a fullscreen alert
			alertText: 'Waiting for game to begin...',

			// The websocket we use to talk to the server
			server: null,
		};
	},

	/**
	 * Connects to the server and sets up handlers for socket events
	 */
	componentDidMount() {
		var server = io.connect();

		server.on('id', (playerId) => this.setState({playerId: playerId}));
		
		// Other player has made a move
		server.on('update', (data) => {
			this.setState(data);
			this.setState({
				alertText: null,
				move: {}
			});
			this.checkForGameOver();
		});

		// Other player disconnected
		server.on('disconnect', () => {
			this.setState({alertText: 'Disconnected'});
		});

		// Game is full
		server.on('full', () => {
			this.setState({alertText: 'A game is already in progress. Try again later.'})
		});

		this.setState({server: server});
	},

	/**
	 * Sends a PASS move to the server
	 */
	pass() {
		this.state.server.emit('move', {
			playerId: this.state.playerId,
			type: 'PASS'
		});
	},

	/**
	 * Checks to see if the game has ended, and updates the alert text if so
	 */
	checkForGameOver() {
		const gameOver = this.state.gameOver,
			  winner = this.state.winner,
			  playerId = this.state.playerId;
		var   alertText;

		if (gameOver) {
			if (winner === playerId) {
				alertText = 'You win!';
			} else if (winner) {
				alertText = 'You lose!';
			} else {
				alertText = 'You tied!';
			}
		}

		this.setState({
			alertText: alertText
		});
	},

	/**
	 * Called whenever one of our children does something to the move object
	 * Submits the move, if it is ready
	 */
	onMoveChange() {
		if (!this.state.activePlayer) {
			return;
		}
		const move = this.state.move;
		
		// Make sure we rerender
		this.forceUpdate();

		// Return if this move isn't ready to send yet
		if (!move.card ||
			move.card.type === 'DECOY' && !move.target ||
			move.card.type === 'HORN' && !move.range) {
			return;
		}

		// This move is ready to send
		move.playerId = this.state.playerId;
		move.type = 'PLAY';
		this.state.server.emit('move', move);
	},

	render() {
		const player = this.state.player,
			  opponent = this.state.opponent,
			  move = this.state.move,
			  alertText = this.state.alertText,
			  activePlayer = this.state.activePlayer;

		return (
			<div>
				{/* Display alert if one exists */}
				{
					alertText &&	
					<div className='alert'><div className='alert-msg'>{alertText}</div></div>
				}
				
				<Sidebar activePlayer={activePlayer} player={player} opponent={opponent} lastPlayed={this.state.lastPlayed} onPass={this.pass}/>
				<div id="board-container">
					<Board playerField={player.field} opponentField={opponent.field} move={move} onSelect={this.onMoveChange}/>
					<Hand {...player.hand} move={move} onSelect={this.onMoveChange}/>
				</div>
			</div>
		);
	}
});

export default Game;