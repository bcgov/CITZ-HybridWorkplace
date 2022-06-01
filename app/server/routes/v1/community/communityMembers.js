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
 *  /api/community/members/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Get all community members by community title or members count.
 *      description: Use optional query 'count=true' to get member count.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: false
 *          name: count
 *          schema:
 *            type: boolean
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community/properties/members'
 *        '400':
 *          description: Bad Request.
 */

// Get all community members by community title or count
router.get("/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({ title: req.params.title });

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    if (req.query.count === "true")
      return res.status(200).json({ count: community.members.length || 0 });

    return res.status(200).json(community.members);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/members/join/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Join community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '204':
 *          description: Successfully joined community.
 *        '400':
 *          description: Bad Request.
 */

// Join community by title
router.patch("/join/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    await Community.updateOne(
      { title: community.title },
      { $push: { members: user.id } }
    );

    await User.updateOne(
      { name: user.name },
      {
        $push: {
          communities: community.title,
        },
      }
    );

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/members/leave/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Leave community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '204':
 *          description: Successfully left community.
 *        '400':
 *          description: Bad Request.
 */

// Leave community by title
router.delete("/leave/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    // Remove user from community
    await Community.updateOne(
      { title: community.title },
      { $pull: { members: user.id } }
    );

    // Remove community from user's communities array
    await User.updateOne(
      { name: user.name },
      {
        $pull: {
          communities: community.title,
        },
      }
    );

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
