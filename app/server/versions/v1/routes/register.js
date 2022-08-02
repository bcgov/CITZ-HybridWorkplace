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
const moment = require("moment");
const axios = require("axios").default;
const ResponseError = require("../classes/responseError");

const router = express.Router();

const User = require("../models/user.model");
const Community = require("../models/community.model");
const getOptions = require("../functions/getOptions");

/**
 * @swagger
 * paths:
 *  /api/register:
 *    post:
 *      tags:
 *        - Auth
 *      summary: Register for an account.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                email:
 *                  $ref: '#/components/schemas/User/properties/email'
 *                password:
 *                  $ref: '#/components/schemas/User/properties/password'
 *      responses:
 *        '403':
 *          description: IDIR or email already exists. **||** <br>Password does not meet requirements. **||** <br>Invalid email. **||** <br>Username does not meet requirements. **||** <br>Invalid string in username.
 *        '201':
 *          description: Registered.
 *        '400':
 *          description: Bad Request.
 */

// Register User
router.post("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding options.");
    const {
      passwordMinLength,
      passwordMaxLength,
      usernameMinLength,
      usernameMaxLength,
      usernameDisallowedStrings,
    } = await getOptions("registration");
    req.log.addAction("Options found.");

    req.log.addAction("Hashing password.");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.log.addAction("Password hashed.");

    req.log.addAction("Checking if user already exists.");
    if (
      await User.exists({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      })
    )
      throw new ResponseError(403, "IDIR or email already exists.");
    req.log.addAction("User does not already exist.");

    // Input validation
    const passwordRegexStr = `(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{${passwordMinLength},${passwordMaxLength}}`;
    const usernameRegexStr = `(?!.*\\s).{${usernameMinLength},${usernameMaxLength}}`;

    const emailPattern = /^\w+([\\.-]\w+)*@\w+([\\.-]\w+)*(\.\w{2,3})+$/;
    const passwordPattern = new RegExp(passwordRegexStr, "g");
    const usernamePattern = new RegExp(usernameRegexStr, "g");

    const passwordError = `Password does not meet requirements: length ${passwordMinLength}-${passwordMaxLength}, must not contain whitespace, must contain at least one (lowercase letter, uppercase letter, number)`;
    const usernameError = `Username does not meet requirements: length ${usernameMinLength}-${usernameMaxLength}, must not contain whitespace.`;

    req.log.addAction("Validating password.");
    if (!passwordPattern.test(req.body.password))
      throw new ResponseError(403, passwordError);
    req.log.addAction("Password is valid.");

    req.log.addAction("Validating email.");
    if (!emailPattern.test(req.body.email))
      throw new ResponseError(403, "Invalid email.");
    req.log.addAction("Email is valid.");

    req.log.addAction("Validating username.");
    if (!usernamePattern.test(req.body.username))
      throw new ResponseError(403, usernameError);

    usernameDisallowedStrings.some((str) => {
      const pattern = new RegExp(str, "g");
      if (pattern.test(req.body.username))
        throw new ResponseError(403, `Invalid string in username: ${str}`);
      return true;
    });
    req.log.addAction("Username is valid.");

    // Create user
    req.log.addAction("Creating user.");
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      registeredOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      postCount: 0,
      notificationFrequency: "none",
    });
    req.log.addAction("User created.");

    req.log.addAction("Adding user to Welcome community members.");
    await Community.updateOne(
      { title: "Welcome" },
      {
        $push: {
          members: user.id,
        },
        $inc: { memberCount: 1 },
      }
    );
    req.log.addAction("User added to Welcome community members.");

    req.log.addAction("Updating user's community list.");
    await User.updateOne(
      { username: req.body.username },
      {
        $push: {
          communities: { community: "Welcome", engagement: 0 },
        },
      }
    );
    req.log.addAction("User's community list updated.");

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
            email_address: req.body.email,
            template_id: process.env.GC_NOTIFY_REGISTRATION_TEMPLATE,
          },
        });
        if (process.env.ENABLE_GC_NOTIFY_TRIAL_MODE) {
          // Trial mode requires users be in a mailing list before they can receive emails
          req.log.addAction("Setting isInMailingList for user to true.");
          await User.updateOne(
            { username: req.body.username },
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

    req.log.setResponse(201, "Success");
    return res.status(201).send("Registered.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
