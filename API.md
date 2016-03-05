| URL | HTTP Verb | Request Body (JSON) | Result |
|:--------------:|:---------:|:------------:|:-------------------------------------------------------:|
| /friends/:userId | GET | empty | Return JSON array of all the current user's friend-objects |
| /friend-requests/:username | GET | empty | Return JSON array of all the current user's outstanding friend requests |
| /request-friend | POST | {"currentUserId": "1", "targetUsername": "a"} | Add current user to target user's friend request array |
| /search-users/:username | GET | empty | Return an array of all users partially matching the username pattern |
| /confirm-friend-request | POST | {"currentUserId": "1", "targetUsername": "a", "targetUserId": "2"} |  Adds the current user and target user to eachother's friends array |
| /profile-photo | POST | {"url": "x", "userId": "1"} | Adds the photo the current user's profile |
| /reject-friend-request | POST | {"currentUserId": "1", "targetUsername": "a"} |  Removes the target user from the current user's friend requests array |
| /unfriend | POST | {"currentUserId": "1", "targetUsername": "a"} |  Removes the current user and target user from eachother's friends array |
| /search-groups/:groupname | GET | empty | Return JSON array of all the groups partially matching the groupname query |
| /groups | POST | {"groupname": "a", "description": "b", "currentUserId": "1"} | Adds a new group |
| /join-group | POST | {"currentUserId": "1", "targetGroupname": "a"} | Lets the current user join the targeted group |
| /groups/:userId | GET | empty | Returns JSON array of all the groups a user is in |
| /imgUpload | POST | {"userId": "1", "data": "x", "longitude": "1", "latitude": "1", "taggedGroups": "['a']" } | Adds photo to photo database and to appropriate groups |
