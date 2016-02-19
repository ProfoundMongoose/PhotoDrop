var imgur = require('imgur');
var Photo = require('./photoModel');

module.exports = {
  // write photo to a file on server
  saveToTmp: function (req, res, next) {
    console.log('POST recieved for photo', req.url)
    var filename
    next();
  },

  // send that file to imgur
  uploadPhoto: function (req, res, next) {
    imgur.uploadFile('/users/jobo440/arnold-schwarzenegger-02.jpg')
    .then(function (json) {
        console.log('saved photo to imgur: ', json.data.link);
        req.imgurLink = json.data.link;
        next()
    })
    .catch(function (err) {
        console.error(err.message);
    });
  },

  // save that photo as  a model in db
  savePhotoModelToDB: function (req, res, next) {
    // test coordinates
    req.body.location = '123214.23423243, 2342353234.232352';
    console.log(req.imgurLink, req.body.location)
    new Photo({
      url: req.imgurLink,
      location: req.body.location
    }).save().then(function(data) {
      console.log('saved new photo model to db ', data)
      next();
    }).catch(function(err) {
      console.log('could not save to db', err)
    })
  }
};
