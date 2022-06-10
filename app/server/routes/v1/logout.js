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
const ResponseError = require("../../responseError");

const User = require("../../models/user.model");

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

router.get("/", async (req, res) => {
  try {
    // Get refresh token from cookies
    if (!(req.cookies && req.cookies.jwt))
      throw new ResponseError(404, "Cookie not found.");
    const refreshToken = req.cookies.jwt;

    // Verify token
    let tokenUser;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) throw new ResponseError(403, "Invalid token.");
      tokenUser = user;
    });

    const user = await User.findOne({ username: tokenUser.username });
    if (!user) throw new ResponseError(404, "User not found.");

    // Compare refreshToken to user.refresh_token from db
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken
    );

    if (!isRefreshTokenValid) throw new ResponseError(403, "Invalid token.");

    await User.updateOne({ username: user.username }, { refreshToken: "" });
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "None" });
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
