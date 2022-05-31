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

const Community = require("../../../models/community.model");
const User = require("../../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/community/rules/{title}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Rules
 *      summary: Set community rules by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                rules:
 *                  $ref: '#/components/schemas/Community/properties/rules'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '401':
 *          description: Not Authorized. Only creator of community can edit community.
 *        '204':
 *          description: Successfully set rules.
 *        '400':
 *          description: Bad Request.
 */

// Set community rules by title
router.put("/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    if (user.name !== community.creator)
      return res
        .status(401)
        .send("Not Authorized. Only creator of community can edit community.");

    await Community.updateOne(
      { title: community.title },
      { $set: { rules: req.body.rules } }
    ).exec();

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/rules/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Rules
 *      summary: Get community rules by title.
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
 *                $ref: '#/components/schemas/Community/properties/rules'
 *        '400':
 *          description: Bad Request.
 */

// Get community rules by title
router.get("/:title", async (req, res) => {
  try {
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.status(404).send("Community not found.");

    return res.status(200).json(community.rules);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
