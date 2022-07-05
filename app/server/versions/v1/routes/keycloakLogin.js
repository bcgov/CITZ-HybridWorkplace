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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @module
 */

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // hashing passwords
const moment = require("moment");

const generateRefreshToken = require("../functions/auth/generateRefreshToken");
const User = require("../models/user.model");
const Community = require("../models/community.model");

const router = express.Router();

const frontendURI =
  process.env.REACT_APP_LOCAL_DEV === "true"
    ? `http://${process.env.FRONTEND_REF}:${process.env.FRONTEND_PORT}`
    : process.env.FRONTEND_REF;

router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Decoding Keycloak JWT Token.");
    const decoded = jwt.decode(req.kauth.grant.access_token.token);

    req.log.addAction("Finding user.");
    let user = await User.findOne({
      username: decoded.idir_username,
    });

    if (!user) {
      req.log.addAction("No user object, creating user.");

      // Parse ministry from display name
      const nameLength =
        decoded.given_name.length + decoded.family_name.length + 3;
      let ministry = decoded.display_name.substring(
        nameLength,
        decoded.display_name.length
      );
      ministry = ministry.split(":");

      user = await User.create({
        username: decoded.idir_username,
        email: decoded.email,
        registeredOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
        postCount: 0,
        notificationFrequency: "none",
        firstName: decoded.given_name,
        lastName: decoded.family_name,
        ministry: ministry[0],
      });
      req.log.addAction("Adding user to Welcome community.");
      await Community.updateOne(
        { title: "Welcome" },
        {
          $push: {
            members: user.id,
          },
          $inc: { memberCount: 1 },
        }
      );
      req.log.addAction("Adding Welcome community to user.");
      await User.updateOne(
        { username: req.body.username },
        {
          $push: {
            communities: { community: "Welcome", engagement: 0 },
          },
        }
      );
      req.log.addAction("User is created.");
    }
    req.log.addAction("Generating refresh token.");
    const refreshToken = generateRefreshToken(user);

    req.log.addAction("Hashing refresh token.");
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    req.log.addAction("Added refresh token to user.");
    await User.updateOne(
      { username: user.username },
      { refreshToken: hashedRefreshToken }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.redirect(frontendURI);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
