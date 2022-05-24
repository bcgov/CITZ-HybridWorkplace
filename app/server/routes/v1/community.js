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

const Community = require("../../models/community.model");
const User = require("../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/community:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Create community
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: body
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: body
 *          required: true
 *          name: description
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/description'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: Community already exists.
 *        '201':
 *          description: Community successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community'
 *        '400':
 *          description: Bad Request.
 */

// Create community
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    if (await Community.exists({ title: req.body.title })) {
      return res.status(403).send("Community already exists.");
    }

    const community = await Community.create({
      title: req.body.title,
      description: req.body.description,
      creator: user.id,
      members: [user.id],
    });

    return res.status(201).json(community);
  } catch (err) {
    return res
      .status(400)
      .send(
        "Bad Request. The Community in the body of the Request is either missing or malformed. " +
          `${err}`
      );
  }
});

/**
 * @swagger
 * paths:
 *  /api/community:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Get all communities the user is a part of
 *      produces:
 *        - application/json
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community'
 *        '400':
 *          description: Bad Request.
 */

// Get all communities you are a part of
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    const communities = await Community.find({ members: user.id }, "", {
      sort: { _id: -1 },
    }).exec();

    if (!communities) return res.sendStatus(404);

    return res.status(200).json(communities);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Get community by title
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community'
 *        '400':
 *          description: Bad Request.
 */

// Get community by title
router.get("/:title", async (req, res) => {
  try {
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.sendStatus(404);

    return res.status(200).json(community);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/{currTitle}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Edit community by title
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      parameters:
 *        - in: path
 *          required: true
 *          name: currTitle
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: body
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: body
 *          name: description
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/description'
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community'
 *        '400':
 *          description: Bad Request.
 */

// Edit community by title
// TODO: AUTH AND FIX PATCH (look in profile.js)
router.patch("/:title", async (req, res) => {
  try {
    // FIX ME: AUTH USER IS MODERATOR
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.sendStatus(404);

    // Update post
    await community.save();
    return res.status(200).json(community);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Delete community by title
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          description: Community removed.
 *        '400':
 *          description: Bad Request.
 */

// Remove community by title
// TODO: AUTH
router.delete("/:title", async (req, res) => {
  try {
    const community = await Community.deleteOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.sendStatus(404);

    // TODO: AUTH ONLY MODERATORS OF COMMUNITY
    return res.status(200).send("Community removed.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
