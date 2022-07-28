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

const router = express.Router();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // hashing
const ResponseError = require("../classes/responseError");

const User = require("../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/logout:
 *    get:
 *      tags:
 *        - Auth
 *      summary: Log out of account.
 *      responses:
 *        '404':
 *          description: Cookie not found **||** <br>User not found.
 *        '403':
 *          description: Invalid token.
 *        '204':
 *          description: Success. No content to return.
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

    // Verify token
    let tokenUser;

    req.log.addAction("Verifying refresh token.");
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) throw new ResponseError(403, "Invalid token.");
      tokenUser = user;
    });
    req.log.addAction("Refresh token verified.");

    req.log.addAction("Finding user.");
    const user = await User.findOne({ username: tokenUser.username });
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

    req.log.addAction("Updating refresh token for user.");
    await User.updateOne({ username: user.username }, { refreshToken: "" });
    req.log.addAction("Refresh token updated for user. Clearing jwt cookie.");
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    req.log.addAction("jwt cookie set to clear.");

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
