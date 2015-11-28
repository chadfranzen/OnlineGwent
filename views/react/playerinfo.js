import React from 'react';
import _ from 'lodash';

const PlayerInfo = React.createClass({
	getDefaultProps() {
		return {
			// The name to display above this player's info
			name: '',

			// The object representing the current state of this player
			player: {},

			// True if it is currently this player's turn
			isTurn: false
		}
	},

	render() {
		const player = this.props.player,
			  cardsRemaining = (player.hand && player.hand.cards && player.hand.cards.length) || 0,
			  livesRemaining = player.lives,
			  hasPassed = player.hasPassed,
			  strength = player.strength || 0,
			  // Determine how many grey/red rubies to show
			  rubies = _.map(new Array(2), (val, i) => {
			  	return <img key={i} className="ruby" src={`../assets/${i < livesRemaining ? '' : 'grey'}ruby.png`}></img>;
			  });

		return (
			<div className={"player-info" + (this.props.isTurn ? " highlight" : "")}>
				<div className="player-strength">{strength}</div>
				<div className="player-name">{this.props.name}</div>
				<span className="cards-remaining">{cardsRemaining}</span>
				{rubies}
				{hasPassed && <div>Passed</div>}
			</div>
		);
	}
});

export default PlayerInfo;