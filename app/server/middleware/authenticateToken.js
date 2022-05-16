require('dotenv').config();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authenticateToken = asyncHandler(async (req, res, next) => {
    try {
      // Get token from header
      let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (token == null) return res.status(401).send('Not Authorized.');

      // Verify token
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Not Authorized.');
        req.user = user
        next();
      });
    } catch (err) {
      console.log(err);
      res.status(401).send('Not Authorized.');
    }
});

module.exports = authenticateToken;
