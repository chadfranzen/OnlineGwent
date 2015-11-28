import React from 'react';
import _ from 'lodash';
import Card from './card.js';
import classNames from 'classnames';

const Row = React.createClass({
	getDefaultProps() {
		return {
			// The cards in this row
			cards: [],

			// True if Commander's Horn is played on this row
			hornIsActive: false,

			// True if weather is currently affeting this row
			weatherIsActive: false,

			// CLOSE, RANGED, or SIEGE
			range: '',

			// The total strength of this row
			strength: 0,

			// The current move we are building
			move: {},

			// A callback for when this row or a card within it is selected
			onSelect: _.noop
		};
	},

	/**
	 * Selects the target for a decoy move, and triggers onSelect
	 * @param  {Number} index the index of the target in the 'cards' array
	 */
	selectTarget(index) {
		this.props.move.target = this.props.cards[index];
		this.props.onSelect();
	},

	/**
	 * Selects the range for a horn move, and triggers onSelect
	 */
	selectRow() {
		this.props.move.range = this.props.range;
		this.props.onSelect();
	},

	render() {
		const move = this.props.move,
			  awaitingRow = move.card && move.card.type === 'HORN' && !move.range && !this.props.hornIsActive,
			  awaitingTarget = move.card && move.card.type === 'DECOY' && !move.target,
			  ulClass = classNames({
			  	'weather': this.props.weatherIsActive
			  }),
			  hornClass = classNames({
			  	'horn': true,
			  	'highlight': awaitingRow,
			  	'active': this.props.hornIsActive
			  });

		const getCards = () => {
			return this.props.cards.map((card, index) => {
				// Make cards selectable if user is creating a decoy move
				var selectable = awaitingTarget && (card.ability !== 'HERO');
				return <Card highlight={selectable} key={index} {...card} onClick={selectable ? _.partial(this.selectTarget, index) : _.noop} />
			});
		};

		return (
			<div className="row" onClick={awaitingRow ? this.selectRow : _.noop}>
				<div className="row-strength">{this.props.strength}</div>
				<div className={hornClass}></div>
				<ul className={ulClass}>
					{getCards()}
				</ul>
			</div>
		);
	}
});

export default Row;