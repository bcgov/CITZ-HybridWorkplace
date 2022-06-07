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
const bcrypt = require("bcryptjs"); // hashing passwords
const ResponseError = require("../../responseError");

const router = express.Router();

const generateToken = require("../../functions/generateToken");
const generateRefreshToken = require("../../functions/generateRefreshToken");

const User = require("../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/login:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Login into account.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                password:
 *                  $ref: '#/components/schemas/User/properties/password'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: Community already exists.
 *        '201':
 *          description: Successfully logged in.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: Access token with short expiry.
 *                  refresh_token:
 *                    type: string
 *                    description: Refresh token with longer expiry.
 *        '400':
 *          description: Bad Request.
 */

// Login
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) return res.status(404).send("User not found.");

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      // Create JWTs
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      // Add or replace refresh token to db
      await User.updateOne(
        { user: user.username },
        { refreshToken: hashedRefreshToken }
      );

      // Create JWT Refresh Cookie (HTTPOnly - JS can't touch)
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      // Send JWT
      return res.status(201).json({ token });
    }
    return res.status(400).send("Bad Request");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
