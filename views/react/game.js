import React from 'react';
import ReactDOM from 'react';
import Sidebar from './sidebar.js';
import Hand from './hand.js';
import Board from './board.js'
import io from 'socket.io-client';

const Game = React.createClass({
	getInitialState() {
		return {
			// Data about this user
			player: {},

			// Data about our opponent
			opponent: {},

			// True if we have lost connection to the server and cannot continue
			error: false,

			// True if the game is ready to play
			gameStarted: false
		};
	},

	componentDidMount() {
		var server = io.connect();
		
		server.on('update', (data) => {
			this.setState(data);
			this.setState({gameStarted: true});
		});

		server.on('disconnect', () => {
			this.setState({error: true});
		});
	},


	render() {
		const player = this.state.player,
			  opponent = this.state.opponent,
			  error = this.state.error,
			  gameStarted = this.state.gameStarted;

		return (
			<div>
				{
					error && 
					<div className='alert'><div className='alert-msg'>Disconnected</div></div>}
				{
					!gameStarted && 
					<div className='alert'><div className='alert-msg'>Waiting for game to begin</div></div>
				}
				
				<Sidebar  player={player} opponent={opponent}/>
				<div id="board-container">
					<Board />
					<Hand {...player.hand}/>
				</div>
			</div>
		);
	}
});

export default Game;