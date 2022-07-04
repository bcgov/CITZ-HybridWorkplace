/* 
 Copyright © 2022 Province of British Columbia

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

const jwt = require("jsonwebtoken");
const ResponseError = require("../classes/responseError");

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from header
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token == null) throw new ResponseError(404, "Token not found..");

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) throw new ResponseError(401, "Invalid token.");
      req.user = user;
      next();
    });
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
};

module.exports = authenticateToken;
