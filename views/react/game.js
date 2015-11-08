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

			// When set, will display the text in a fullscreen alert
			alertText: 'Waiting for game to begin...'
		};
	},

	componentDidMount() {
		var server = io.connect();
		
		server.on('update', (data) => {
			this.setState(data);
			this.setState({alertText: null});
		});

		server.on('disconnect', () => {
			this.setState({alertText: 'Disconnected'});
		});

		server.on('full', () => {
			this.setState({alertText: 'A game is already in progress. Try again later.'})
		});
	},


	render() {
		const player = this.state.player,
			  opponent = this.state.opponent,
			  move = this.state.move,
			  alertText = this.state.alertText;

		return (
			<div>
				{
					alertText &&	
					<div className='alert'><div className='alert-msg'>{alertText}</div></div>
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