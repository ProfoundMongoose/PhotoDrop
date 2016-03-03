// Uncomment one of the two following lines to use the appriopriate host for your purposes:
var host = '159.203.240.124'; // production server
// var host = '127.0.0.1'; // local dev testing server

var api = {
  login(username, password) {
    var user = { username: username, password: password };
    var url = 'http://' + host + ':8000/login';
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  },

  signup(username, password) {
    var user = { username: username, password: password };
    return fetch('http://' + host + ':8000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  },

  changePassword(username, password, newPassword) {
    var user = { username: username, password: password, newPassword: newPassword };
    return fetch('http://' + host + ':8000/changePassword', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  },

  changeUsername(username, newUsername) {
    var user = { username: username, newUsername: newUsername };
    return fetch('http://' + host + ':8000/changeUsername', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
  },

  checkJWT(JWT, callback) {
    var url = 'http://' + host + ':8000/checkJWT/' + JWT;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(userData) { // handle error here for some reason catch was not working
      if (userData.status === 404) {
        console.log('Problem with GET request for JWT');
      } else {
        callback(userData._bodyInit);
      }
    });
  },

  uploadProfilePhoto(data, userId, callback) {
    console.log("data in the api.utils: ", data);
    var url = 'http://' + host + ':8000/profile-photo';
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: data,
        userId: userId
      })
    }).then(function(res) {
      callback(res._bodyText);
    }).catch(function(err) { console.log(err); });
  },

  uploadPhoto(data, latitude, longitude, userId, callback) {
    var url = 'http://' + host + ':8000/imgUpload';
    // cut data in half
    var firstHalf = data.slice(0, Math.floor(data.length / 2));
    var secondHalf = data.slice(Math.floor(data.length / 2));
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
      }).catch(function(err) { console.log(err); });
    }).catch(function(err) { console.log(err); });
  },

  fetchPhotos(latitude, longitude, radius, callback) {
    var url = 'http://' + host + ':8000/fetchPhotos?lat=' + latitude + '&lon=' + longitude + '&radius=' + radius;
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
    var url = 'http://' + host + ':8000/fetchLocations?lat=' + latitude + '&lon=' + longitude + '&latdelta=' + latdelta + '&londelta=' + londelta;
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
    var url = 'http://' + host + ':8000/fetchUserPhotos?userId=' + userId;
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

  fetchUserFavorites(userId, callback) {
    var url = 'http://' + host + ':8000/fetchUserFavorites?userId=' + userId;
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
    var url = 'http://' + host + ':8000/incrementViews?url=' + url;
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

  toggleFavorite(userId, url, callback) {
    var url = 'http://' + host + ':8000/toggleFavorite?userId=' + userId + '&url=' + url;
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

  getPhotoData(url, userId, callback) {
    var url = 'http://' + host + ':8000/getPhotoData?url=' + url + '&userId=' + userId;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function(data) {
      callback(data._bodyInit);
    })
    .catch(function(err) {
      console.log(err);
    });
  },

  searchUsers(usernameQuery, callback) {
    var url = 'http://' + host + ':8000/search-users/' + usernameQuery;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (data) {
      callback(data._bodyText);
    })
    .catch(function (err) {
      console.error(err);
    });
  },

  addFriend(currentUserId, targetUsername) {
    var request = {
      currentUserId: currentUserId,
      targetUsername: targetUsername
    };
    console.log(`Building request to ${targetUsername}`);
    return fetch('http://' + host + ':8000/request-friend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then(function (data) {
      if (data.ok) {
        console.log('Friend Request Sent!');
      } else {
        console.log('Something went wrong with your friend request');
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  },

  acceptFriendRequest(currentUserId, targetUsername, targetUserId) {
    var request = {
      currentUserId: currentUserId,
      targetUsername: targetUsername,
      targetUserId: targetUserId
    };
    return fetch('http://' + host + ':8000/confirm-friend-request', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })
    .then(function (data) {
      if (data.ok) {
        console.log('Friend Request Accepted!');
      } else {
        console.log('Something went wrong while accepting the friend request');
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  },

  getFriendRequests(currentUsername, callback) {
    var url = 'http://' + host + ':8000/friend-requests/' + currentUsername;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (data) {
      console.log('friends data: ', data);
      callback(JSON.parse(data._bodyText));
    })
    .catch(function (err) {
      console.error(err);
    });
  },

  getAllFriends(currentUsername, callback) {
    var url = 'http://' + host + ':8000/friends/' + currentUsername;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (data) {
      console.log(data);
      callback(JSON.parse(data._bodyText));
    })
    .catch(function (err) {
      console.error(err);
    });
  }

};

module.exports = api;
