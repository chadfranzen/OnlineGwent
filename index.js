var Backbone = require('backbone');
var _ = require('lodash');
var express = require('express');
var app = express();
var Connections = require('./connections.js');

app.set('port', (process.env.PORT || 5000));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/', function(request, response) {
	response.render('main');
});

var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
var io = require('socket.io').listen(server);


io.on('connection', Connections.addClient);