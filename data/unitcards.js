var _ = require('lodash');
var Cards = [];
function addCards(Card, num) {
	_.times(num, () => Cards.push(_.clone(Card)));
}

addCards({
	type: 'UNIT',
	name: 'Redanian Foot Soldier',
	range: 'CLOSE',
	baseStrength: 1
}, 2);

addCards({
	type: 'UNIT',
	name: 'Poor Infantry',
	range: 'CLOSE',
	baseStrength: 1,
	ability: 'TIGHT BOND'
}, 3);

addCards({
	type: 'UNIT',
	name: 'Yarpen Zigrin',
	range: 'CLOSE',
	baseStrength: 2
}, 1);

addCards({
	type: 'UNIT',
	name: 'Siegfried of Denesle',
	range: 'CLOSE',
	baseStrength: 5
}, 1);

addCards({
	type: 'UNIT',
	name: 'Ves',
	range: 'CLOSE',
	baseStrength: 5
}, 1);

addCards({
	type: 'UNIT',
	name: 'Zoltan Chivay',
	range: 'CLOSE',
	baseStrength: 5
}, 1);

addCards({
	type: 'UNIT',
	name: 'Vesemir',
	range: 'CLOSE',
	baseStrength: 6
}, 1);

addCards({
	type: 'UNIT',
	name: 'Blue Stripes Commando',
	range: 'CLOSE',
	baseStrength: 4,
	ability: 'TIGHT BOND'
}, 3);

addCards({
	type: 'UNIT',
	name: 'Sigismund Dijkstra',
	range: 'CLOSE',
	baseStrength: 4,
	ability: 'SPY'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Prince Stennis',
	range: 'CLOSE',
	baseStrength: 5,
	ability: 'SPY'
}, 1);

addCards({
	type: 'UNIT',
	name: "Avallac'h",
	range: 'CLOSE',
	baseStrength: 0,
	ability: 'SPY'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Sabrina Glevissig',
	range: 'RANGED',
	baseStrength: 4
}, 1);

addCards({
	type: 'UNIT',
	name: 'Sheldon Skaggs',
	range: 'RANGED',
	baseStrength: 4
}, 1);

addCards({
	type: 'UNIT',
	name: 'Keira Metz',
	range: 'RANGED',
	baseStrength: 5
}, 1);

addCards({
	type: 'UNIT',
	name: 'Sile de Tansarville',
	range: 'RANGED',
	baseStrength: 5
}, 1);

addCards({
	type: 'UNIT',
	name: 'Dethmold',
	range: 'RANGED',
	baseStrength: 6
}, 1);

addCards({
	type: 'UNIT',
	name: 'Crinfrid Reavers Dragon',
	range: 'RANGED',
	baseStrength: 5,
	ability: 'TIGHT BOND'
}, 3);

addCards({
	type: 'UNIT',
	name: 'Ballista',
	range: 'SIEGE',
	baseStrength: 6
}, 1);

addCards({
	type: 'UNIT',
	name: 'Trebuchet',
	range: 'SIEGE',
	baseStrength: 6
}, 2);

addCards({
	type: 'UNIT',
	name: 'Siege Tower',
	range: 'SIEGE',
	baseStrength: 6
}, 1);

addCards({
	type: 'UNIT',
	name: 'Catapult',
	range: 'SIEGE',
	baseStrength: 8,
	ability: 'TIGHT BOND'
}, 2);

addCards({
	type: 'UNIT',
	name: 'Kaedweni Siege Expert',
	range: 'SIEGE',
	baseStrength: 1,
	ability: 'MORALE BOOST'
}, 3);

addCards({
	type: 'UNIT',
	name: 'Thaler',
	range: 'SIEGE',
	baseStrength: 1,
	ability: 'SPY'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Geralt of Rivia',
	range: 'CLOSE',
	baseStrength: 15,
	ability: 'HERO'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Cirilla Fiona Elen',
	range: 'CLOSE',
	baseStrength: 15,
	ability: 'HERO'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Yennefer of Vengerberg',
	range: 'RANGED',
	baseStrength: 7,
	ability: 'HERO'
}, 1);

addCards({
	type: 'UNIT',
	name: 'Triss Merigold',
	range: 'CLOSE',
	baseStrength: 7,
	ability: 'HERO'
}, 1);

module.exports = Cards;
