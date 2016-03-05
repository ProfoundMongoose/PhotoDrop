module.exports = {
  errorLogger: function (error, req, res, next) {
    console.error(error.stack);
    next(error);
  },
  errorHandler: function (error, req, res, next) {
    res.status(500).send(error.message);
  },
  badReturnedObjectResponse: function (type, searchParam, res) {
    res.status(400);
    res.json({errorMessage: 'No ' + type + ' found with that ' + searchParam + '. Please try again'});
  }
};
