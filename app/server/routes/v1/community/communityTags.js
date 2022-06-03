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
const Post = require("../../../models/post.model");

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Get community tags by title.
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
 *                $ref: '#/components/schemas/Community/properties/tags'
 *        '400':
 *          description: Bad Request.
 */

// Get community tags by title
router.get("/:title", async (req, res) => {
  try {
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.status(404).send("Community not found.");

    return res.status(200).json(community.tags);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Create community tag by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: tag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/tags/items/properties/tag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Tag not found in query.
 *        '401':
 *          description: Not Authorized. Only creator of community can edit community.
 *        '403':
 *          description: A community can't have more than 7 tags. **||** <br>No duplicate tags.
 *        '204':
 *          description: Successfully created tag.
 *        '400':
 *          description: Bad Request.
 */

// Create community tag by community title
router.post("/:title", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");
    if (!req.query.tag) return res.status(404).send("Tag not found in query.");

    if (user.username !== community.creator)
      return res
        .status(401)
        .send("Not Authorized. Only creator of community can edit community.");

    if (
      await Community.exists({
        title: community.title,
        "tags.tag": req.query.tag,
      })
    )
      return res.status(403).send("No duplicate tags.");

    if (await Community.exists({ title: community.title, tags: { $size: 7 } }))
      return res.status(403).send("A community can't have more than 7 tags.");

    await Community.updateOne(
      { title: community.title },
      { $push: { tags: { tag: req.query.tag, count: 0 } } }
    );

    return res.status(204).send("");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Remove community tag by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: tag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/tags/items/properties/tag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Tag not found in query.
 *        '401':
 *          description: Not Authorized. Only creator of community can edit community.
 *        '204':
 *          description: Successfully removed tag.
 *        '400':
 *          description: Bad Request.
 */

// Remove community tag by community title
router.delete("/:title", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");
    if (!req.query.tag) return res.status(404).send("Tag not found in query.");

    if (user.username !== community.creator)
      return res
        .status(401)
        .send("Not Authorized. Only creator of community can edit community.");

    // Remove tag from community
    await Community.updateOne(
      { title: community.title },
      { $pull: { tags: { tag: req.query.tag } } }
    );

    // Remove tag from posts within community
    await Post.updateMany(
      { community: community.title },
      { $pull: { tags: { tag: req.query.tag } } }
    );

    return res.status(204).send("");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
