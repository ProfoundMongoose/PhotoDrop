var api = {
  login(username, password){
    var user = {username: username, password: password};
    var url = 'http://localhost:8000/login';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(user)
    });
  },

  signup(username, password){
    var user = {username: username, password: password};
    return fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  uploadPhoto(data, latitude, longitude) {
    var url = 'http://localhost:8000/imgUpload';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        data: data,
        latitude: latitude,
        longitude: longitude,
      })
    }).catch(function(err){ console.log(err) });
  },

  fetchPhotos(latitude, longitude, callback) {
    var url = 'http://localhost:8000/fetchPhotos?lat='+latitude+'&lon='+longitude;
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
