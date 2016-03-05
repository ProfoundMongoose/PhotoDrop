var userController = require('../users/userController.js');
var photoController = require('../photos/photoController.js');
var groupController = require('../groups/groupController.js');
var helpers = require('./helpers.js');

module.exports = function(app, express) {

  // upload photo to imgur and store link in database
  app.post('/imgUpload',
    photoController.uploadPhoto,
    photoController.savePhotoModelToDB);

  // Fetching photos for the map view and user photos
  app.get('/fetchPhotos/', photoController.fetchPhotos);
  app.get('/fetchFriendsPhotos/', photoController.fetchFriendsPhotos);
  app.get('/fetchLocations/', photoController.fetchLocations);
  app.get('/fetchUserLocations/', photoController.fetchUserLocations);
  app.get('/fetchFriendsLocations/', photoController.fetchFriendsLocations);
  app.get('/fetchUserPhotos/', photoController.fetchUserPhotos);
  app.get('/fetchUserPhotosNearby/', photoController.fetchUserPhotosNearby);
  app.get('/fetchUserFavorites/', userController.fetchFavorites);

  // Increment views count on photo and add to Favorites
  app.get('/incrementViews/', photoController.incrementViews);
  app.get('/toggleFavorite/', userController.toggleFavorite);
  app.get('/getPhotoData/', userController.getPhotoData);

  // Sign in and sign up routes
  app.post('/login', userController.login);
  app.post('/signup', userController.signup);
  app.get('/checkJWT/:JWT', userController.checkJWT);

  // Change user information
  app.put('/changePassword', userController.changePassword);
  app.post('/changeUsername', userController.changeUsername);
  app.post('/profile-photo', userController.savePhotoToUserInDB);

  // Social routes - Please see API.md for API endpoint chart
  app.get('/friends/:username', userController.fetchFriends);
  app.get('/friend-requests/:userId', userController.fetchFriendRequests);
  app.post('/request-friend', userController.requestFriend);
  app.get('/search-users/:username', userController.searchUsers);
  app.post('/confirm-friend-request', userController.confirmFriendRequest);
  app.post('/reject-friend-request', userController.rejectFriendRequest);
  app.post('/unfriend', userController.unfriend);
  app.get('/search-groups/:groupname', groupController.searchGroups);
  app.post('/groups', groupController.addGroup);
  app.get('/groups/:userId', groupController.getUsersGroups)
  app.post('/join-group', groupController.joinGroup);

  // Handle errors for unsupported requests
  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);
};
