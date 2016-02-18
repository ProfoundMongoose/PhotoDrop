var api = {
  login(username, password){
    var url = 'http://127.0.0.1:8000/login';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify({username: username, password: password})
    }).then((res) => res.json()

  );
  }
};

module.exports = api;