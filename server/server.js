var express = require('express');
var app = express();
// reqire bodyparser middleware for dealing with POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: true })); 
app.use(express.json());
app.use(express.urlencoded()); 



app.listen(8000, function() {
  console.log('Starting server. Listening on 8000')
});