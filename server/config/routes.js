var userController = require('../users/userController.js');
var helpers = require('./helpers.js');

module.exports = function (app, express) {
  app.get('/api/users', userController.allUsers);
  app.post('/login', function(req, res) {
    console.log('login POST recieved', req.body);
  });
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};