var Group = require('./groupModel');
var User = require('../users/userModel');
var mongoose = require('mongoose');

module.exports = {

  searchGroups: function (req, res, next) {
    var regexSearch = new RegExp(req.params.groupname, 'i');
    Group.find({groupname: regexSearch}, {_id: 1, groupname: 1, description: 1}, function (err, groups) {
      console.log('called');
      if (err) {
        next(err);
      }
      res.json(groups);
    });
  },

  addGroup: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {_id: 1, username: 1}, function (err, currentUser) {
      var group = new Group({
        groupname: req.body.groupname,
        description: req.body.description,
        administrator: currentUser.username
      });
      group.save(function (err) {
        if (err) {
          next(err);
        }
        res.sendStatus(201);
      });
    });
  },

  joinGroup: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {_id: 1, username: 1, groups: 1}, function (err, currentUser) {
      if (err) {
        next(err);
      }
      Group.findOne({groupname: req.body.targetGroupname}, {_id: 1, groupname: 1, members: 1}, function (err, targetGroup) {
        targetGroup.members.addToSet({
          _id: mongoose.mongo.ObjectID(currentUser._id),
          username: currentUser.username
        });
        targetGroup.save(function (err) {
          if (err) {
            next(err);
          }
          currentUser.groups.addToSet({
            _id: mongoose.mongo.ObjectID(targetGroup._id),
            groupname: targetGroup.groupname
          });
          currentUser.save(function (err) {
            if (err) {
              next(err);
            }
            res.sendStatus(201);
          });
        });
      });
    });
  }

};
