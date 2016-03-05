var Group = require('./groupModel');
var User = require('../users/userModel');
var mongoose = require('mongoose');

module.exports = {

  searchGroups: function (req, res, next) {
    var regexSearch = new RegExp(req.params.groupname, 'i');
    Group.find({groupname: regexSearch}, {_id: 1, groupname: 1, description: 1}, function (err, groups) {
      if (err) {
        return next(err);
      } else {
        res.json(groups);
      }
    });
  },

  addGroup: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {_id: 1, username: 1, groups: 1}, function (err, currentUser) {
      var group = new Group({
        groupname: req.body.groupname,
        description: req.body.description,
        administrator: currentUser.username,
        members: [
          {
            _id: mongoose.mongo.ObjectID(currentUser._id),
            username: currentUser.username
          }
        ]
      });
      group.save(function (err) {
        if (err) {
          return next(err);
        } else {
          currentUser.groups.addToSet({
            _id: mongoose.mongo.ObjectID(group._id),
            groupname: group.groupname
          });
          currentUser.save(function (err) {
            if (err) {
              return next(err);
            } else {
              res.sendStatus(201);
            }
          });
        }
      });
    });
  },

  joinGroup: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {_id: 1, username: 1, groups: 1}, function (err, currentUser) {
      if (err) {
        return next(err);
      } else {
        Group.findOne({groupname: req.body.targetGroupname}, {_id: 1, groupname: 1, members: 1}, function (err, targetGroup) {
          targetGroup.members.addToSet({
            _id: mongoose.mongo.ObjectID(currentUser._id),
            username: currentUser.username
          });
          targetGroup.save(function (err) {
            if (err) {
              return next(err);
            } else {
              currentUser.groups.addToSet({
                _id: mongoose.mongo.ObjectID(targetGroup._id),
                groupname: targetGroup.groupname
              });
              currentUser.save(function (err) {
                if (err) {
                  return next(err);
                } else {
                  res.sendStatus(201);
                }
              });
            }
          });
        });
      }
    });
  },


  getUsersGroups: function (req, res, next) {
    Group.find({ members: { $elemMatch: { _id: mongoose.mongo.ObjectID(req.params.userId) } } }, (err, groups) => {
      if (err) {
        return next(err);
      }
      console.log('groups (should be an array of objects):', groups);
      if (groups) {
        res.json(groups);
      } else {
        res.json(null);
      }
    });
  },

  addPhotoToGroups: function (req, res, next) {
    Group.update({groupname: {$in: req.body.taggedGroups}}, {$addToSet: {photoUrls: req.imgurLink}}, {multi: true}, function (err, status) {
      if (err) {
        return next(err);
      }
      res.sendStatus(201);
    });
  }

};
