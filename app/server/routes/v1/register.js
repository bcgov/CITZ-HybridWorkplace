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

const router = express.Router();

const User = require("../../models/user.model");
const Community = require("../../models/community.model");

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
 *          description: Forbidden (IDIR or email already exists).
 *        '201':
 *          description: Registered.
 *        '400':
 *          description: Bad Request.
 */

// Register User
router.post("/", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (
      await User.exists({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      })
    )
      return res.status(403).send("IDIR or email already exists.");

    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await Community.updateOne(
      { title: "Welcome" },
      {
        $push: {
          members: user.id,
        },
      }
    );

    await User.updateOne(
      { username: req.body.username },
      {
        $push: {
          communities: "Welcome",
        },
      }
    );

    return res.status(201).send("Registered.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
