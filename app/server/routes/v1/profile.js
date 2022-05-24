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
 *  /api/profile:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Profile
 *      summary: Get user's profile.
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

// Get user's profile
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
 *  /api/profile:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Profile
 *      summary: Edit user's profile.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  $ref: '#/components/schemas/User/properties/name'
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
 *        '204':
 *          description: Profile successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit user's profile
router.patch("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      // if the field in req.body exists, update/set it
      if (user[key] && user[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      } else if (!user[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await User.updateOne({ name: req.user.name }, query).exec();

    return res.sendStatus(204);
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
 *  /api/profile/{name}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Profile
 *      summary: Get user profile by name.
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

// Get user profile by name
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

module.exports = router;
