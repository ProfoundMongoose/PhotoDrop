var api = {
  login(username, password){
    var user = {username: username, password: password};
    var url = 'http://127.0.0.1:8000/login';
    return fetch(url, {
      method: "POST",
      body: JSON.stringify(user)
    });
  },

  signup(username, password){
    var user = {username: username, password: password};
    console.log('trying to signup with ',username, password);
    return fetch('http://127.0.0.1:8000/signup', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }
};

module.exports = api;