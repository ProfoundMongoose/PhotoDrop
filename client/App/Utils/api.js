var api = {
  login(username, password) {
    var user = { username: username, password: password };
    var url = 'http://162.243.130.124:8000/login';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(user)
    });
  },

  signup(username, password) {
    var user = { username: username, password: password };
    return fetch('http://162.243.130.124:8000/signup', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  changePassword(username, password, newPassword) {
    console.log('calling change with params: ', username, password, newPassword);
    var user = { username: username, password: password, newPassword: newPassword };
    return fetch('http://162.243.130.124:8000/changePassword', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  changeUsername(username, newUsername) {
    var user = { username: username, newUsername: newUsername };
    return fetch('http://162.243.130.124:8000/changeUsername', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  },

  checkJWT(JWT, callback) {
    var url = 'http://162.243.130.124:8000/checkJWT/' + JWT;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(userData) { // handle error here for some reason catch was not working
      if (userData.status === 404) console.log('Problem with GET request for JWT');
      else callback(userData._bodyInit);
    });
  },

  uploadPhoto(data, latitude, longitude, userId, callback) {
    var url = 'http://162.243.130.124:8000/imgUpload';
    // cut data in half
    var firstHalf = data.slice(0, Math.floor(data.length / 2));
    var secondHalf = data.slice(Math.floor(data.length / 2))
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: firstHalf,
        latitude: latitude,
        longitude: longitude,
        userId: userId
      })
    }).then(function() {
      fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: secondHalf,
          latitude: latitude,
          longitude: longitude,
          userId: userId
        })
      }).then(function(res) {
        callback(res._bodyText);
      }).catch(function(err) { console.log(err) });
    }).catch(function(err) { console.log(err) });
  },

  fetchPhotos(latitude, longitude, radius, callback) {
    var url = 'http://162.243.130.124:8000/fetchPhotos?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(photos) {
        callback(photos._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  fetchLocations(latitude, longitude, latdelta, londelta, callback) {
    var url = 'http://162.243.130.124:8000/fetchLocations?lat=' + latitude + '&lon=' + longitude + '&latdelta=' + latdelta + '&londelta=' + londelta;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(photos) {
        callback(photos._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  },


  fetchUserPhotos(userId, callback) {
    var url = 'http://162.243.130.124:8000/fetchUserPhotos?userId=' + userId;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(photos) {
        callback(photos._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  fetchUserFavorites(usedId, callback) {
    var url = 'http://162.243.130.124:8000/fetchUserFavorites?userId=' + userId;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(photos) {
        callback(photos._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  incrementViews(url, callback) {
    var url = 'http://162.243.130.124:8000/incrementViews?url=' + url;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(result) {
        callback(result._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  },

  addToFavorites(userId, url, callback) {
    var url = 'http://162.243.130.124:8000/addtoFavorites?userId=' + userId + '&url=' + url;
    return fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function(result) {
        callback(result._bodyInit);
      })
      .catch(function(err) {
        console.log(err);
      });
  }

};

module.exports = api;
