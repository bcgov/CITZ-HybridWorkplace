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

require("dotenv").config();
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authenticateToken = asyncHandler(async (req, res, next) => {
  try {
    // Get token from header
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (token == null) return res.status(401).send("Missing token.");

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Bad Request.`);
  }
});

module.exports = authenticateToken;
