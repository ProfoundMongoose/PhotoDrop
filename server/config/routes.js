var userController = require('../users/userController.js');
var photoController = require('../photos/photoController.js');
var helpers = require('./helpers.js');

module.exports = function (app, express) {
  app.get('/api/users', userController.allUsers);

  // upload photo to imgur and store link in database
  app.post('/imgUpload',
    photoController.saveToTmp,
    photoController.uploadPhoto,
    photoController.savePhotoModelToDB,
    function(req, res) {
      res.sendStatus(200);
  });

  app.post('/login', function(req, res) {
    console.log('login POST recieved', req.body);
  });

  app.use(helpers.errorLogger);

  app.use(helpers.errorHandler);
};
