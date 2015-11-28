import React from 'react';
import _ from 'lodash';
import Card from './card.js';

const Hand = React.createClass({
	getDefaultProps() {
		return {
			// The list of card objects in this hand
			cards: [],

			// The current move we are trying to construct
			move: {},

			// Called when the user selects a card in the hand
			onSelect: _.noop
		}
	},

	/**
	 * Sets the 'card' attribute on the move to be the card selected,
	 * and calls the onSelect callback
	 * @param  {Number} index the index in the 'cards' array of the card selected
	 */
	selectCard(index) {
		this.props.move.card = this.props.cards[index];
		this.props.onSelect();
	},

	render() {
		const getCards = () => {
			return this.props.cards.map((card, index) => {
				return <Card key={index} {...card} onClick={_.partial(this.selectCard, index)} />
			});
		};

		return (
			<div className='hand'>
				<ul>
					{getCards()}
				</ul>
			</div>
		);
	}
});

export default Hand;