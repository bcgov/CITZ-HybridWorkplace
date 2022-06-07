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
const ResponseError = require("../../responseError");

const router = express.Router();

const User = require("../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/user:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Get user.
 *      description: Returns properties of user that have been set.
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Successfully found user. Returns the following properties if set.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    $ref: '#/components/schemas/User/properties/username'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  firstName:
 *                    $ref: '#/components/schemas/User/properties/firstName'
 *                  lastName:
 *                    $ref: '#/components/schemas/User/properties/lastName'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *        '400':
 *          description: Bad Request.
 */

// Get user
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/user:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Edit user.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  $ref: '#/components/schemas/User/properties/email'
 *                firstName:
 *                  $ref: '#/components/schemas/User/properties/firstName'
 *                lastName:
 *                  $ref: '#/components/schemas/User/properties/lastName'
 *                bio:
 *                  $ref: '#/components/schemas/User/properties/bio'
 *                title:
 *                  $ref: '#/components/schemas/User/properties/title'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: One of the fields you tried to edit, can not be edited.
 *        '204':
 *          description: User successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit user
router.patch("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) return res.status(404).send("User not found.");

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      if (key === "username" || key === "registeredOn")
        return res
          .status(403)
          .send("One of the fields you tried to edit, can not be edited.");

      // if the field in req.body exists, update/set it
      if (user[key] && user[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      } else if (!user[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await User.updateOne({ username: req.user.username }, query).exec();

    return res.status(204).send("");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{username}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Get user by username.
 *      description: Returns properties of user that have been set.
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/username'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Successfully found user.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    $ref: '#/components/schemas/User/properties/username'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  firstName:
 *                    $ref: '#/components/schemas/User/properties/firstName'
 *                  lastName:
 *                    $ref: '#/components/schemas/User/properties/lastName'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *        '400':
 *          description: Bad Request.
 */

// Get user by username
router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).exec();

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{username}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Remove user by username.
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/username'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '401':
 *          description: Not Authorized. Must be user to delete user.
 *        '204':
 *          description: Successfully removed user.
 *        '400':
 *          description: Bad Request.
 */

// Remove user by username
router.delete("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).exec();

    if (!user) return res.status(404).send("User not found.");

    if (user.username !== req.user.username)
      return res.status(401).send("Not Authorized.");

    await User.deleteOne({ username: user.username }).exec();

    return res.status(204).send("");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
