import React from 'react';
import Card from './card.js';

const Hand = React.createClass({
	getDefaultProps() {
		return {
			// The list of card objects in this hand
			cards: []
		}
	},

	render() {
		const getCards = () => {
			return this.props.cards.map((card, id) => <Card key={id} {...card} />);
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