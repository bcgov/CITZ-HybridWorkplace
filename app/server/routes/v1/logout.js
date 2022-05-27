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
 *          description: Missing Cookie or missing User.
 *        '403':
 *          description: Forbidden.
 *        '401':
 *          description: Unauthorized. Invalid token.
 *        '204':
 *          description: Successfully logged out.
 *        '400':
 *          description: Bad Request.
 */

// TODO: ON CLIENT delete token on logout
router.get("/", async (req, res) => {
  try {
    // Get refresh token from cookies
    if (!(req.cookies && req.cookies.jwt))
      return res.status(404).send("Missing cookie.");
    const refreshToken = req.cookies.jwt;

    // Verify token
    let tokenUser;

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.status(403).send("Forbidden.");
      tokenUser = user;
    });

    const user = await User.findOne({ name: tokenUser.name });
    if (!user) return res.status(404).send("User not found.");

    if (refreshToken !== user.refresh_token)
      return res.status(401).send("Unauthorized. Invalid token.");

    await User.updateOne({ name: user.name }, { refresh_token: "" });
    res.clearCookie("jwt", { httpOnly: true });
    res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
