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

const router = express.Router();

const generateToken = require("../middleware/generateToken");
const User = require("../models/user.model");

router.get("/", async (req, res) => {
  // Get refresh token from cookies
  if (!(req.cookies && req.cookies.jwt)) return res.sendStatus(401);
  const refreshToken = req.cookies.jwt;

  // Check refresh token exists
  const user = await User.findOne({ refresh_token: refreshToken });
  if (!user) return res.status(403).send("Forbidden.");

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, decodedUser) => {
      // Check decoded user is the same as user holding token in db
      if (err || decodedUser.name !== user.name)
        return res.status(403).send("Forbidden.");
      const token = generateToken({ name: user.name });
      return res.json({ token });
    }
  );
});

module.exports = router;
