var api = {
  login(username, password){
    var user = {username: username, password: password};
<<<<<<< HEAD
    var url = 'http://45.55.23.71:8000/login';
=======
    var url = 'http://162.243.130.124:8000/login';
>>>>>>> ec690d917a1d4448e1eed53d92fb501c64311b43
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(user)
    });
  },

  signup(username, password){
    var user = {username: username, password: password};
<<<<<<< HEAD
    return fetch('http://45.55.23.71:8000/signup', {
=======
    return fetch('http://162.243.130.124:8000/signup', {
>>>>>>> ec690d917a1d4448e1eed53d92fb501c64311b43
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  uploadPhoto(data, latitude, longitude) {
<<<<<<< HEAD
    var url = 'http://45.55.23.71:8000/imgUpload';
=======
    var url = 'http://162.243.130.124:8000/imgUpload';
>>>>>>> ec690d917a1d4448e1eed53d92fb501c64311b43
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        data: data,
        // loc: [longitude, latitude]
        latitude: latitude,
        longitude: longitude,
      })
    }).catch(function(err){ console.log(err) });
  },

  fetchPhotos(latitude, longitude, radius, callback) {
<<<<<<< HEAD
    var url = 'http://45.55.23.71:8000/fetchPhotos?lat='+latitude+'&lon='+longitude+'&radius='+radius;
=======
    var url = 'http://162.243.130.124:8000/fetchPhotos?lat='+latitude+'&lon='+longitude+'&radius='+radius;
>>>>>>> ec690d917a1d4448e1eed53d92fb501c64311b43
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err){
      console.log(err);
    });
  },

  fetchLocations(latitude, longitude, latdelta, londelta, callback) {
<<<<<<< HEAD
    var url = 'http://45.55.23.71:8000/fetchLocations?lat='+latitude+'&lon='+longitude+'&latdelta='+latdelta+'&londelta='+londelta;
=======
    var url = 'http://162.243.130.124:8000/fetchLocations?lat='+latitude+'&lon='+longitude+'&latdelta='+latdelta+'&londelta='+londelta;
>>>>>>> ec690d917a1d4448e1eed53d92fb501c64311b43
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(photos) {
      callback(photos._bodyInit);
    })
    .catch(function(err){
      console.log(err);
    });
  }
};

module.exports = api;
