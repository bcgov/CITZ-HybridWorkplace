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

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // hashing
const generateToken = require("../functions/auth/generateToken");
const ResponseError = require("../classes/responseError");

const router = express.Router();

const User = require("../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/token:
 *    get:
 *      tags:
 *        - Auth
 *      summary: Use refresh token to retreive a new access token.
 *      responses:
 *        '404':
 *          description: Cookie not found. **||** <br>User not found.
 *        '401':
 *          description: Invalid token.
 *        '200':
 *          description: Success.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: Access token with short expiry.
 *        '400':
 *          description: Bad Request.
 */

router.get("/", async (req, res, next) => {
  try {
    // Get refresh token from cookies
    req.log.addAction("Finding jwt cookie.");
    if (!(req.cookies && req.cookies.jwt))
      throw new ResponseError(404, "Cookie not found.");
    const refreshToken = req.cookies.jwt;
    req.log.addAction("jwt cookie found.");

    let username;

    // Verify token and get user.username from token
    req.log.addAction("Verifying refresh token.");
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, tokenUser) => {
        if (err) throw new ResponseError(401, "Invalid token.");
        username = tokenUser.username;
      }
    );
    req.log.addAction("Refresh token verified.");

    req.log.addAction("Finding user.");
    const user = await User.findOne({ username });
    if (!user) throw new ResponseError(404, "User not found.");
    req.log.addAction("User found.");

    // Compare refreshToken to user.refresh_token from db
    req.log.addAction("Checking refresh token is valid.");
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) throw new ResponseError(403, "Invalid token.");
    req.log.addAction("Refresh token is valid.");

    req.log.addAction("Generating new access token.");
    const token = generateToken(user);
    req.log.addAction("Access token generated.");

    req.log.setResponse(200, "Success");
    return res.status(200).json({ token });
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
