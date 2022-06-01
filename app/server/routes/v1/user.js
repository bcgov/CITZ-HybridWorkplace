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
 *                  name:
 *                    $ref: '#/components/schemas/User/properties/name'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  first_name:
 *                    $ref: '#/components/schemas/User/properties/first_name'
 *                  last_name:
 *                    $ref: '#/components/schemas/User/properties/last_name'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *                  quote:
 *                    $ref: '#/components/schemas/User/properties/quote'
 *        '400':
 *          description: Bad Request.
 */

// Get user
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      name: user.name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the body of the Request is either missing or malformed. ${err}`
      );
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
 *                first_name:
 *                  $ref: '#/components/schemas/User/properties/first_name'
 *                last_name:
 *                  $ref: '#/components/schemas/User/properties/last_name'
 *                bio:
 *                  $ref: '#/components/schemas/User/properties/bio'
 *                title:
 *                  $ref: '#/components/schemas/User/properties/title'
 *                quote:
 *                  $ref: '#/components/schemas/User/properties/quote'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: Not allowed to edit name.
 *        '204':
 *          description: User successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit user
router.patch("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      if (key === "name")
        return res.status(403).send("Not allowed to edit name.");

      // if the field in req.body exists, update/set it
      if (user[key] && user[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      } else if (!user[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await User.updateOne({ name: req.user.name }, query).exec();

    return res.status(204).send("");
  } catch (err) {
    // Error wasn't explicitly thrown
    if (!err.statusCode) {
    } else {
      return res.status(err.statusCode).send(err.response);
    }
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{name}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Get user by name.
 *      description: Returns properties of user that have been set.
 *      parameters:
 *        - in: path
 *          name: name
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/name'
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
 *                  name:
 *                    $ref: '#/components/schemas/User/properties/name'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  first_name:
 *                    $ref: '#/components/schemas/User/properties/first_name'
 *                  last_name:
 *                    $ref: '#/components/schemas/User/properties/last_name'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *                  quote:
 *                    $ref: '#/components/schemas/User/properties/quote'
 *        '400':
 *          description: Bad Request.
 */

// Get user by name
router.get("/:name", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).exec();

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      name: user.name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the params of the Request is either missing or malformed. ${err}`
      );
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{name}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Remove user by name.
 *      parameters:
 *        - in: path
 *          name: name
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/name'
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

// Remove user by name
router.delete("/:name", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).exec();

    if (!user) return res.status(404).send("User not found.");

    if (user.name !== req.user.name)
      return res.status(401).send("Not Authorized.");

    await User.deleteOne({ name: user.name }).exec();

    return res.status(204).send("");
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the params of the Request is either missing or malformed. ${err}`
      );
  }
});

module.exports = router;
