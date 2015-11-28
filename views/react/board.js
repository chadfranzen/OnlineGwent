import React from 'react';
import Row from './row.js';
import _ from 'lodash';

const Board = React.createClass({
	getDefaultProps() {
		return {
			// The field belonging to the user
			playerField: {},

			// The field belonging to the opponent
			opponentField: {},

			// The current move we are trying to build
			move: {},

			// Called when a user selects a card in the field
			onSelect: _.noop
		}
	},

	render() {
		return (
			<div id="board">
				{/* Additional spacing at top */}
				<div style={{height: '9px'}}></div>
				
				{/* Opponent field */}
				<div className="field">
					<Row {...this.props.opponentField.SIEGE}/>
					<Row {...this.props.opponentField.RANGED}/>
					<Row {...this.props.opponentField.CLOSE}/>
				</div>

				{/* Player field */}
				<div className="field">
					<Row {...this.props.playerField.CLOSE} move={this.props.move} onSelect={this.props.onSelect} />
					<Row {...this.props.playerField.RANGED} move={this.props.move} onSelect={this.props.onSelect} />
					<Row {...this.props.playerField.SIEGE} move={this.props.move} onSelect={this.props.onSelect} />
				</div>
			</div>
		);
	}
});

export default Board;