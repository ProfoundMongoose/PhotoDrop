var imgur = require('imgur');
var Photo = require('./photoModel');
var Q = require('q');

// var LATITUDE, LONGITUDE;

// navigator.geolocation.getCurrentPosition(
//   location => {
//     // console.log(location);  <--location returns in this format
//     // { coords: 
//     //    { speed: -1,
//     //      longitude: -1.42,
//     //      latitude: 22,
//     //      accuracy: 5,
//     //      heading: -1,
//     //      altitude: 0,
//     //      altitudeAccuracy: -1 },
//     //   timestamp: 477548452582.683 }
//     // var search = location.coords.latitude + ',' + location.coords.longitude;
//     LATITUDE = location.coords.latitude;
//     LONGITUDE = location.coords.longitude;
//   }
// );

var getPhotos = Q.nbind(Photo.find, Photo);

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
    // test coordinates
    // req.body.location = '123214.23423243, 2342353234.232352';
    console.log(req.imgurLink, req.body);
    new Photo({
      url: req.imgurLink,
      loc: {
        type: 'Point',
        coordinates: [req.body.longitude, req.body.latitude]
      }
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

    getPhotos({
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
        res.status(200).send(photos);
      })
      .fail(function(error) {
        console.log('error: ',error);
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
    console.log('coords: ', coords);

    getPhotos({
      loc: {
        $geoWithin: {
          $geometry: {
             type: "Polygon" ,
             coordinates: coords 
          }
        }
      }
    })
      .then(function(photos) {
        console.log('photos polygon: ', photos);
        res.status(200).send(photos);
      })
      .fail(function(error) {
        console.log('error: ',error);
        next(error);
      });
  }
};
