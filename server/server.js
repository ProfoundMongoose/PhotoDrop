var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var portNum = 8000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

mongoose.connect('mongodb://localhost/photodrop');
var db = mongoose.connection;

require('./config/routes.js')(app, express);

app.listen(portNum, function () {
  console.log('Server started. Listening on port ' + portNum);
});

module.exports = {
  app: app,
  db: db
};
