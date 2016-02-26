var imgur = require('imgur');
var Photo = require('./photoModel');
var mongoose = require('mongoose');

module.exports = {
  // send that file to imgur
  uploadPhoto: function (req, res, next) {
    imgur.uploadBase64(req.body.data)
      .then(function (json) {
        console.log(json.data.link);
        req.imgurLink = json.data.link;
        next();
      })
      .catch(function (err) {
        console.error(err.message);
      });
  },

  // save that photo as  a model in db
  savePhotoModelToDB: function (req, res, next) {
    console.log(JSON.parse(req.body.userId));
    new Photo({
      url: req.imgurLink,
      loc: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      },
      userId: JSON.parse(req.body.userId)
    }).save().then(function(data) {
      Photo.ensureIndexes({loc:"2dsphere"});
      console.log('saved new photo model to db ', data)
      next();
    }).catch(function(err) {
      console.log('could not save to db', err)
    })
  },

  // fetch all photos from DB
  fetchPhotos: function (req, res, next) {
    var maxDistance = Number(req.query.radius);
    var coords = [req.query.lon, req.query.lat];

    Photo.find({
      loc: {
        $near: {
          $geometry: {
             type: "Point" ,
             coordinates: coords 
          },
          $maxDistance: maxDistance
        }
      }
    })
      .then(function(photos) {
        res.json(photos);
      })
      .fail(function(error) {
        // console.log('error: ',error);
        next(error);
      });
  },

  fetchLocations: function (req, res, next) {
    var lat = Number(req.query.lat);
    var lon = Number(req.query.lon);
    var latdelta = Number(req.query.latdelta);
    var londelta = Number(req.query.londelta);
    var coords = [[
      [lon-londelta, lat+latdelta],
      [lon+londelta, lat+latdelta],
      [lon+londelta, lat-latdelta],
      [lon-londelta, lat-latdelta],
      [lon-londelta, lat+latdelta]
    ]];

    var revealedPhotos = undefined;

    Photos.find({
      loc: {
        $near: {
          $geometry: {
             type: "Point" ,
             coordinates: [req.query.lon, req.query.lat]
          },
          $maxDistance: 50
        }
      }
    }).select('_id')
      .then(function(photos) {
        revealedPhotos = photos;
        Photo.find({
          loc: {
            $geoWithin: {
              $geometry: {
                 type: "Polygon" ,
                 coordinates: coords
              }
            }
          }
        }).nin('_id', revealedPhotos)
          .then(function(photos) {
            res.json(photos);
          })
          .fail(function(error) {
            console.log('error: ',error);
            next(error);
          });
      })
      .fail(function(error) {
        next(error);
      })
  }
};