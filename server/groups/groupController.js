var Group = require('./groupModel');

module.exports = {

  searchGroups: function (req, res, next) {
    var regexSearch = new RegExp(req.params.groupname, 'i');
    Group.find({name: regexSearch}, {_id: 0, name: 1}, function (err, groups) {
      console.log('called');
      if (err) {
        next(err);
      }
      res.json(groups);
    });
  }

};
