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

const router = express.Router();

const generateToken = require("../middleware/generateToken");
const generateRefreshToken = require("../middleware/generateRefreshToken");

const User = require("../models/user.model");

// Login
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({
      name: req.body.name,
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

      // Add or replace refresh token to db
      await User.updateOne(
        { user: user.name },
        { refresh_token: refreshToken }
      );

      // Send JWT Refresh Cookie (HTTPOnly - JS can't touch)
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
      });

      // Send JWT
      return res.status(201).json({ token, refreshToken });
    }
    return res.status(400).send("Bad Request");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
