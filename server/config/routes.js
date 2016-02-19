var userController = require('../users/userController.js');
var photoController = require('../photos/photoController.js');
var helpers = require('./helpers.js');

module.exports = function(app, express) {

  // upload photo to imgur and store link in database
  app.post('/imgUpload',
    photoController.uploadPhoto,
    photoController.savePhotoModelToDB,
    function(req, res) {
      res.sendStatus(200);
    });

  // Sign in and sign up routes
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);

  // Handle errors for unsupported requests
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
