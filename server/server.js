var express = require('express');
var app = express();
var mongoose = require('mongoose');

// reqire bodyparser middleware for dealing with POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true })); 
// app.use(express.json());
// app.use(express.urlencoded()); 

mongoose.connect('mongodb://localhost/profoundmongoose');

require('./config/routes.js')(app, express);

app.listen(8000, function() {
  console.log('Starting server. Listening on 8000');
});