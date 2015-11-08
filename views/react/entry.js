import React from 'react';
import ReactDOM from 'react-dom';
import Game from './game.js';

$(document).ready( () => {
	ReactDOM.render(<Game />, document.getElementById('container'));
});