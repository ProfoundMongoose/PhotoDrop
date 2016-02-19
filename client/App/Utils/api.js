var api = {
  login(username, password){
    var url = 'http://127.0.0.1:8000/login';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({username: username, password: password})
    }).then((res) => res.json()

  );
},

  uploadPhoto(data, coordinates) {
    var url = 'http://127.0.0.1:8000/imgUpload';
    return fetch(url, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        data: data,
        location: coordinates
      })
    }).catch(function(err){ console.log(err) });
  }
};

module.exports = api;
