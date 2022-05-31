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
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // hashing

const router = express.Router();

const generateToken = require("../../middleware/generateToken");
const User = require("../../models/user.model");

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
 *          description: User not found.
 *        '401':
 *          description: Unauthorized (missing cookie).
 *        '403':
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

router.get("/", async (req, res) => {
  try {
    // Get refresh token from cookies
    if (!(req.cookies && req.cookies.jwt)) return res.sendStatus(401);
    const refreshToken = req.cookies.jwt;

    let username;

    // Verify token and get user.name from token
    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      (err, tokenUser) => {
        if (err) return res.status(403).send("Invalid token.");
        username = tokenUser.name;
      }
    );

    const user = await User.findOne({ name: username });
    if (!user) return res.status(404).send("User not found.");

    // Compare refreshToken to user.refresh_token from db
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refresh_token
    );

    if (!isRefreshTokenValid) return res.status(403).send("Invalid token.");

    const token = generateToken(user);
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
