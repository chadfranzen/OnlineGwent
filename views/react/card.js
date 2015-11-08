import React from 'react';
import _ from 'lodash';

const Card = React.createClass({
	render() {
		return (
			<li className="card">
				<div className="name">{this.props.name}</div>

				{_.isNumber(this.props.strength) && <div className="strength">{this.props.strength}</div>}
			</li>
		);
	}
});

export default Card;