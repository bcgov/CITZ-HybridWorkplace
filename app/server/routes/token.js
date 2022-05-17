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

const Tokens = require("../models/refreshTokens.model");

router.post("/", async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  const tokenExists = await Tokens.exists({ token: refreshToken });
  if (!tokenExists) return res.status(403).send("Not Authorized.");
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).send("Not Authorized.");
    const token = generateToken({ name: user.name, password: user.password });
    res.json({ token: token });
  });
});

module.exports = router;
