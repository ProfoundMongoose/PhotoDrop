var imgur = require('imgur');
var Photo = require('./photoModel');
var mongoose = require('mongoose');

module.exports = {
  // recieve base64 bit image in two POST request packets
  // send that file to imgur
  uploadPhoto: (function() {
    var currentPipes = {
      // key pairs are the userId and the data.
      userId: 'data'
    }
    return function(req, res, next) {
      // check if it is first or second packet
      var userId = req.body.userId;
      if (currentPipes[userId] === undefined) {
        currentPipes[userId] = req.body.data;
        // if the userId is there, we know that the photo is halfway upladed
      } else if (currentPipes[userId]) {
        var fullImgData = currentPipes[userId] + req.body.data;
        // clear out userId data space for future images
        currentPipes[userId] = undefined;
        imgur.uploadBase64(fullImgData)
          .then(function(json) {
            console.log(json.data.link);
            req.imgurLink = json.data.link;
            next();
          })
          .catch(function(err) {
            console.error(err.message);
          });
      }

    }
  })(),

  // save that photo as  a model in db
  savePhotoModelToDB: function(req, res, next) {
    new Photo({
      url: req.imgurLink,
      loc: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      },
      userId: mongoose.mongo.ObjectID(req.body.userId)
    }).save().then(function(data) {
      Photo.ensureIndexes({ loc: "2dsphere" });
      console.log('saved new photo model to db ', data)
      res.json();
    }).catch(function(err) {
      console.error('could not save to db', err.message);
    })
  },

  // fetch all photos from DB
  fetchPhotos: function(req, res, next) {
    var maxDistance = Number(req.query.radius);
    var coords = [req.query.lon, req.query.lat];

    Photo.find({
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: coords
          },
          $maxDistance: maxDistance
        }
      }
    }, function(err, photos) {
      if (err) next(err); 
      res.json(photos);
    });
  },

  fetchLocations: function(req, res, next) {
    var lat = Number(req.query.lat);
    var lon = Number(req.query.lon);
    var latdelta = Number(req.query.latdelta);
    var londelta = Number(req.query.londelta);
    var coords = [
      [
        [lon - londelta, lat + latdelta],
        [lon + londelta, lat + latdelta],
        [lon + londelta, lat - latdelta],
        [lon - londelta, lat - latdelta],
        [lon - londelta, lat + latdelta]
      ]
    ];

    var revealedPhotos = undefined;

    Photo.find({
      loc: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [req.query.lon, req.query.lat]
          },
          $maxDistance: 50
        }
      }
    }, function(err, photos) {
      if (err) next(err);
      revealedPhotos = photos;
      Photo.find({
        loc: {
          $geoWithin: {
            $geometry: {
              type: "Polygon",
              coordinates: coords
            }
          }
        },
        _id: {
          $nin: revealedPhotos.map(function(photo) {
            return photo._id
          })
        }
      }, 'loc', function(err, photos) {
        if (err) next(err);
        res.json(photos);
      });
    })
  },

  fetchUserPhotos: function(req, res, next) {
    Photo.find({ userId: mongoose.mongo.ObjectID(req.query.userId)}, function(err, photos) {
      if (err) next(err); 
      res.json(photos);
    });
  },

  incrementViews: function(req, res, next) {
    Photo.findOne({ url: req.query.url }, function(err, photo) {
      if (err) next(err);
      if (!photo) {
        return next(new Error('Link not added yet'));
      }
      photo.views++;
      photo.save(function(err, savedPhoto) {
        console.log('saved photo', savedPhoto);
        if (err) next(err);
        res.json(savedPhoto.views);
      });
    })
  }

};
