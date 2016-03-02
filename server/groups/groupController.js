var Group = require('./groupModel');

module.exports = {

  searchGroups: function (req, res, next) {
    var regexSearch = new RegExp(req.params.groupname, 'i');
    Group.find({groupname: regexSearch}, {_id: 0, groupname: 1, description: 1}, function (err, groups) {
      console.log('called');
      if (err) {
        next(err);
      }
      res.json(groups);
    });
  },

  addGroup: function (req, res, next) {
    console.log('in groupController.js ... req.body:');
    console.log(req.body);
    var group = new Group({groupname: req.body.groupname, description: req.body.description});
    group.save(function (err) {
      if (err) {
        next(err);
      }
      res.sendStatus(201);
    });
  }

};
