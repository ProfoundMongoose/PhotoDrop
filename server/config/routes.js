var userController = require('../users/userController.js');
var photoController = require('../photos/photoController.js');
var helpers = require('./helpers.js');

module.exports = function(app, express) {

  // upload photo to imgur and store link in database
  app.post('/imgUpload',
    photoController.uploadPhoto,
    photoController.savePhotoModelToDB);

  // Fetching photos for the map view and user photos
  app.get('/fetchPhotos/', photoController.fetchPhotos);
  app.get('/fetchLocations/', photoController.fetchLocations);
  app.get('/fetchUserPhotos/', photoController.fetchUserPhotos);
  app.get('/fetchUserFavorites/', userController.fetchFavorites);

  // Increment views count on photo and add to Favorites
  app.get('/incrementViews/', photoController.incrementViews);
  app.get('/toggleFavorite/', userController.toggleFavorite);
  app.get('/getUsername/', userController.getUsername);

  // Sign in and sign up routes
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.get('/checkJWT/:JWT', userController.checkJWT);

  // Change user information
  app.post('/changePassword', userController.changePassword);
  app.post('/changeUsername', userController.changeUsername);

  // Handle errors for unsupported requests
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
