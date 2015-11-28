import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

const Card = React.createClass({
	getDefaultProps() {
		return {
			// One of (UNIT, WEATHER, HORN, DECOY, SCORCH)
			type: '',

			// The name of the card
			name: '',

			// If this is a unit card, will hold the card's total strength
			strength: null,

			// One of (NONE, MORALE BOOST, TIGHT BOND, HERO)
			ability: '',

			// When true, the card have an inner glow
			highlight: false,

			// Called whenever a user clicks on this card
			onClick: _.noop
		};
	},

	render() {
		var type = this.props.type,
			highlight = this.props.highlight,
			ability = this.props.ability.split(' ').join(''),
			shouldShowAbility = ability && (ability !== 'NONE') && (ability !== 'HERO'),
			classObj = {
				'card': true,
				'HERO': ability === 'HERO',
				'highlight': highlight
			},
			liClass;

		// Determine CSS classes to set on card
		classObj[type] = true;
		if (type === 'WEATHER' || type === 'UNIT') {
			classObj[this.props.range] = true;
		}
		liClass = classNames(classObj);

		return (
			<li className={liClass} onClick={this.props.onClick}>
				<div className="name">{this.props.name}</div>

				{/* Conditionally display info bubbles at bottom of card */}
				{_.isNumber(this.props.strength) && <div className="strength">{this.props.strength}</div>}
				{shouldShowAbility && <div className={`ability ${ability}`}></div>}
			</li>
		);
	}
});

export default Card;