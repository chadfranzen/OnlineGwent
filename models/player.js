const Backbone = require('backbone');
const _ = require('lodash');
const Deck = require('./deck.js');
const Hand = require('./hand.js');
const Field = require('./field.js');

const Player = Backbone.Model.extend({
	defaults: {
		// The game this player is a part of
		game: null,

		// The other player in the game
		opponent: null,

		// The field this player owns
		field: null,

		// The deck this player owns
		deck: null,

		// The hand this player owns
		hand: null,

		// The number of lives (rounds) this player has remaining
		lives: 2,

		// True if this player has passed for this round
		hasPassed: false
	},

	initialize() {
		this.set('deck', new Deck());

		var hand = new Hand({owner: this});
		hand.on('play', this.cardPlayed, this);
		this.set('hand', hand);
		
		var field = new Field();
		field.on('remove', this.cardRemoved, this);
		this.set('field', field);
	},

	/**
	 * @return {Number} the total strength of all card this player has in play
	 */
	getStrength() {
		return this.get('field').getStrength();
	},

	/**
	 * Places a card we've just played onto our field and
	 * bubbles up the play event
	 * @param  {Card} card the card that was just played
	 */
	cardPlayed(card) {
		const type = card.get('type'),
			  ability = card.get('ability'),
			  field = this.get('field'),
			  opponentField = this.get('opponent') && this.get('opponent').get('field');

		switch (type) {
			case 'UNIT':
				if (ability === 'SPY') {
					opponentField.addCard(card);
				} else {
					field.addCard(card);
				}
				break;
			case 'HORN':
				field.addCard(card);
				break;
			case 'SCORCH':
				const maxStrength = Math.max(field.getMaxStrength(), opponentField.getMaxStrength());
				field.removeWhere(maxStrength);
				opponentField.removeWhere(maxStrength);
				break;
			case 'DECOY':
				field.addCard(card);
				break;
			default:
				break;
		}

		this.trigger('play', this, card);
	},

	/**
	 * Takes a card that has been removed from the field, and
	 * adds it to the discard pile or the hand
	 * @param {Array} the list of cards that were removed
	 * @param {Boolean} returnToHand true if this card should be returned
	 *                               to the hand rather than discarding
	 */
	cardRemoved(card, returnToHand) {
		var deck = this.get('deck'),
			hand = this.get('hand');

		if (returnToHand) {
			hand.addCard(card);
		} else {
			deck.discard(card);
		}
	},

	/**
	 * Passes for this round
	 */
	pass() {
		this.set('hasPassed', true);
		this.trigger('pass', this);
	},

	/**
	 * To be called at the end of a round
	 * Updated the player's lives, clears the field
	 * @param {Boolean} true if this player won the round
	 */
	endRound(won) {
		if (!won) {
			this.set('lives', this.get('lives') - 1);
		}

		this.get('field').clearField();
		this.set('hasPassed', false);
	},

	toJSON() {
		return {
			deck: this.get('deck').toJSON(),
			hand: this.get('hand').toJSON(),
			field: this.get('field').toJSON(),
			lives: this.get('lives'),
			strength: this.get('strength')
		}
	},
});

module.exports = Player;