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
    User.findOne({_id: mongoose.mongo.ObjectID(req.params.userId)}, {_id: 0, groups: 1}, function (err, user) {
      if (err) {
        return next(err);
      }
      if (user) {
        user.groups.reduce((groupsWithUsers, groupObj, index, originalGroupsArr) => {
          Group.findOne({groupname: groupObj.groupname}, {groupname: 1, administrator: 1, members: 1, description: 1}, (err, groupInfo) => {
            if (err) {
              next(err);
            }
            if (groupsWithUsers) {
              groupsWithUsers.push(groupInfo);
            }
            if (index === groupsWithUsers.length - 1) {
              res.json(groupsWithUsers);
            }
            return groupsWithUsers;
          });
        }, []);
      } else {
        console.log('user object isnt what you expected: ', user);
        res.json(null);
      }
    });
  },

  fetchFriends: function (req, res, next) {
    console.log('passed username:', req.params.username);
    User.findOne({username: req.params.username}, {friends: 1, _id: 0, profilePhotoUrl: 1}, function (err, user) {
      if (err) {
        next(err);
      }
      if (user) {
        user.friends.reduce((fullFriendsArray, friendObj, index, originalFriendsArray) => {
          User.findOne({username: friendObj.username}, {username: 1, profilePhotoUrl: 1}, (err, friendInfo) => {
            if (err) {
              next(err);
            }
            if (fullFriendsArray) {
              fullFriendsArray.push(friendInfo);
            }
            if (index === originalFriendsArray.length - 1) {
              res.json(fullFriendsArray);
            }
            return fullFriendsArray;
          });
        }, []);
      } else {
        console.log('user object isnt what you expected: ', user);
        res.json(null);
      }
    });
  },

};
