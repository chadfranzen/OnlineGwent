import React from 'react';

const Sidebar = React.createClass({
	getDefaultProps() {
		return {
			player: {},
			opponent: {}
		}
	},

	render() {
		return (
			<div id="sidebar">
				<p>Opponent: {this.props.player.lives}</p>
				<p>Player: {this.props.opponent.lives}</p>
			</div>
		);
	}
});

export default Sidebar;