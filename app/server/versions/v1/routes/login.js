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
const bcrypt = require("bcryptjs"); // hashing passwords
const ResponseError = require("../classes/responseError");

const router = express.Router();

const generateToken = require("../functions/auth/generateToken");
const generateRefreshToken = require("../functions/auth/generateRefreshToken");

const User = require("../models/user.model");

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
 *        '401':
 *          description: Invalid username or password.
 *        '201':
 *          description: Successfully logged in.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  token:
 *                    type: string
 *                    description: Access token.
 *        '400':
 *          description: Bad Request.
 */

// Login
router.post("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) throw new ResponseError(401, "Invalid username or password.");
    req.log.addAction("User found.");

    req.log.addAction("Checking password is valid.");
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordValid) {
      req.log.addAction("Password is valid.");
      // Create JWTs
      req.log.addAction("Generating tokens.");
      const token = generateToken(user);
      const refreshToken = generateRefreshToken(user);
      req.log.addAction("Tokens generated.");

      req.log.addAction("Hashing refresh token.");
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      req.log.addAction("Refresh token hashed.");

      // Add or replace refresh token to db
      req.log.addAction("Updating refresh token in database.");
      await User.updateOne(
        { username: user.username },
        { refreshToken: hashedRefreshToken }
      );
      req.log.addAction("Refresh token in database updated.");

      // Create JWT Refresh Cookie (HTTPOnly - JS can't touch)
      req.log.addAction("Creating jwt cookie.");
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      req.log.addAction("jwt cookie created.");

      // Send JWT
      req.log.setResponse(201, "Success");
      return res.status(201).json({ token });
    }
    throw new ResponseError(401, "Invalid username or password.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
