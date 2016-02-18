var imgur = require('imgur')

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
        console.log(json.data.link);
    })
    .catch(function (err) {
        console.error(err.message);
    });
  },

  // save that photo as  a model in db
  savePhotoModelToDB: function (req, res, next) {
    next();
  }
};
