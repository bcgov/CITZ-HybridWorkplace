/* eslint-disable prefer-destructuring */
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
const findSingleDocuments = require("../functions/findSingleDocuments");

const router = express.Router();

const User = require("../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/online:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Check online status.
 *      description: Doesn't update the user's online status, allowing you to check your own online status.
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Success.
 *        '400':
 *          description: Bad Request.
 */

// Check online status
router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    const onlineUser = await User.aggregate([
      { $match: { username: user.username } },
      { $project: { _id: 0, online: 1 } },
    ]);

    req.log.setResponse(200, "Success");
    res.status(200).json(onlineUser[0]);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
