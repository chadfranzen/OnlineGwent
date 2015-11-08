var _ = require('lodash');
var Cards = [];
function addCards(Card, num) {
	_.times(num, () => Cards.push(_.clone(Card)));
}

addCards({
	type: 'WEATHER',
	name: 'Clear Weather',
	range: 'ALL'		
}, 2);

addCards({
	type: 'WEATHER',
	name: 'Biting Frost',
	range: 'CLOSE'		
}, 3);

addCards({
	type: 'WEATHER',
	name: 'Impenetrable Fog',
	range: 'RANGED'		
}, 2);

addCards({
	type: 'WEATHER',
	name: 'Torrential Rain',
	range: 'SIEGE'		
}, 2);

addCards({
	type: 'HORN'
}, 2);

addCards({
	type: 'SCORCH'
}, 2);

addCards({
	type: 'DECOY'
}, 2);

module.exports = Cards;