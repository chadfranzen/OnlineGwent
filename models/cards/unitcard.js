const Backbone = require('backbone');
const _ = require('lodash');

const UnitCard = Backbone.Model.extend({
	defaults: {
		// The type of this card, one of (UNIT, WEATHER)
		type: 'UNIT',

		// The name of this card
		name: '',

		// The range of this card; one of (CLOSE, RANGED, SIEGE)
		range: 'CLOSE',

		// If this unit is on the field, this will hold the Row it is in
		row: null,

		// The initial strength of this card, before any effects are activated
		baseStrength: 0,

		// This card's special ability, if it has one. One of (NONE, TIGHT BOND, MORALE BOOST, SPY, HERO)
		ability: 'NONE'
	},

	/**
	 * The strength of the card is the base strength + any additional modifiers (e.g. weather)
	 * @return {Number} the card's strength after any modifiers
	 */
	getStrength() {
		var strength = this.get('baseStrength'),
			ability = this.get('ability'),
			row = this.get('row');

		// No special abilities to think about if we don't have a row
		// And heroes aren't affected by special abilities
		if (!row || ability === 'HERO') {
			return strength;
		}

		// Weather sets strength to 1
		if (row.weatherIsActive()) {
			strength = Math.min(1, strength);
		}
		// Find the number of morale boost cards in our row (that aren't us)
		var moraleBoostCount = _.filter(row.get('cards'), (card) => {
				return (card !== this) && (card.get('ability') === 'MORALE BOOST');
			}).length;
		strength += moraleBoostCount;

		if (ability === 'TIGHT BOND') {
			// Find the number of other cards of the same name in this row
			var partnersCount = _.filter(row.get('cards'), (card) => {
					return card.get('name') === this.get('name');
				}).length - 1;

			strength += (strength * partnersCount);
		}

		// A Commander's Horn on this row doubles strength
		if (row.get('hornIsActive')) {
			strength *= 2;
		}

		return strength;
	},

	/**
	 * Plays this unit card. The 'play' event will bubble up
	 */
	play() {
		// Don't play a card that's already been played
		if (this.get('row')) {
			return;
		}

		this.trigger('play', this);
	},

	toJSON() {
		const clone = _.clone(this.attributes);
		return {
			type: clone.type,
			name: clone.name,
			range: clone.range,
			baseStrength: clone.baseStrength,
			strength: this.getStrength(),
			ability: clone.ability
		};
	}
});

module.exports = UnitCard;