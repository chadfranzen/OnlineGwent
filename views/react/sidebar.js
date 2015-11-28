import React from 'react';
import _ from 'lodash';
import PlayerInfo from './playerinfo.js';
import Card from './card.js';

const Sidebar = React.createClass({
	getDefaultProps() {
		return {
			player: {},
			opponent: {},
			lastPlayed: null,
			onPass: _.noop,
			activePlayer: true
		}
	},

	render() {
		return (
			<div id="sidebar">
				<PlayerInfo isTurn={!this.props.activePlayer} name="Opponent" player={this.props.opponent} />
				<div className="last-played">
					<span>Last<br />Played</span>
					{this.props.lastPlayed && <Card {...this.props.lastPlayed} />}
				</div>
				<PlayerInfo isTurn={this.props.activePlayer} name="Player" player={this.props.player} />
				<a className="pass" onClick={this.props.onPass}>Pass</a>
			</div>
		);
	}
});

export default Sidebar;