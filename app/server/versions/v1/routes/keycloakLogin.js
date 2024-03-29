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
const axios = require("axios").default;
const moment = require("moment");
const ResponseError = require("../classes/responseError");

const generateRefreshToken = require("../functions/auth/generateRefreshToken");
const User = require("../models/user.model");
const Community = require("../models/community.model");

const defineOfflineStatusJob = require("../jobs/defineOfflineStatusJob");
const { agenda } = require("../../../db");

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
        role: "user",
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
        { username: user.username },
        {
          $push: {
            communities: { community: "Welcome", engagement: 0 },
          },
        }
      );
      req.log.addAction("User is created.");

      // GC Notify
      if (process.env.ENABLE_GC_NOTIFY === "true") {
        req.log.addAction("Sending gcNotify request.");
        try {
          await axios({
            method: "post",
            url: "https://api.notification.canada.ca/v2/notifications/email",
            headers: {
              Authorization: `ApiKey-v1 ${process.env.GC_NOTIFY_API_KEY_SECRET}`,
              "Content-Type": "application/json",
            },
            data: {
              email_address: user.email,
              template_id: process.env.GC_NOTIFY_REGISTRATION_TEMPLATE,
            },
          });
          if (process.env.ENABLE_GC_NOTIFY_TRIAL_MODE) {
            // Trial mode requires users be in a mailing list before they can receive emails
            req.log.addAction("Setting isInMailingList for user to true.");
            await User.updateOne(
              { username: user.username },
              { $set: { isInMailingList: true } }
            );
          }
          req.log.addAction("gcNotify request sent.");
        } catch (err) {
          req.log.addAction(
            "gcNotify could not complete. Email is most likely not included in the email list on gcNotify."
          );
        }
      }
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

    // Define job for offline status
    await defineOfflineStatusJob(agenda, user.id);
    // Schedule offline status
    await agenda.schedule("in 5 minutes", `offlineStatus-${user.id}`);
    // Set online status
    await User.updateOne({ _id: user.id }, { online: true });

    req.log.setResponse(201, "Success");
    return res.redirect(frontendURI);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
  }
});

module.exports = router;
