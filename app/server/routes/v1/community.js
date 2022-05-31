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
const Post = require("../../models/post.model");

/**
 * @swagger
 * paths:
 *  /api/community:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Create community.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Community/properties/title'
 *                description:
 *                  $ref: '#/components/schemas/Community/properties/description'
 *                rules:
 *                  $ref: '#/components/schemas/Community/properties/rules'
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
      creator: user.name,
      members: [user.id],
      rules: req.body.rules,
    });

    await User.updateOne(
      { name: user.name },
      {
        $push: {
          communities: community.title,
        },
      }
    );

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
 *      summary: Get all communities the user is a part of.
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
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
    const communities = await Community.find({ members: user.id }, "", {
      sort: { _id: -1 },
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!communities) return res.status(404).send("Community not found.");

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
 *      summary: Get community by title.
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

    if (!community) return res.status(404).send("Community not found.");

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
 *      summary: Edit community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: currTitle
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Community/properties/title'
 *                description:
 *                  $ref: '#/components/schemas/Community/properties/description'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '401':
 *          description: Not Authorized. Only creator of community can edit community.
 *        '204':
 *          description: Community successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit community by title
// TODO: AUTH
router.patch("/:title", async (req, res) => {
  try {
    // TODO: AUTH USER IS MODERATOR
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

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      // if the field in req.body exists, update/set it
      if (community[key] && community[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      } else if (!community[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await Community.updateOne({ title: community.title }, query).exec();

    return res.sendStatus(204);
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
 *      summary: Delete community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '401':
 *          description: Not Authorized. Only creator of community can edit community.
 *        '200':
 *          description: Community removed.
 *        '400':
 *          description: Bad Request.
 */

// Remove community by title
// TODO: AUTH
router.delete("/:title", async (req, res) => {
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

    await Community.deleteOne({
      title: req.params.title,
    }).exec();

    // TODO: AUTH ONLY MODERATORS OF COMMUNITY
    return res.status(200).send("Community removed.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/join/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
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
 *  /api/community/leave/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
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

    await Community.updateOne(
      { title: community.title },
      { $pull: { members: user.id } }
    );

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

/**
 * @swagger
 * paths:
 *  /api/community/rules/{title}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
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
router.put("/rules/:title", async (req, res) => {
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
 *        - Community
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
router.get("/rules/:title", async (req, res) => {
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

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
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
router.get("/tags/:title", async (req, res) => {
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
 *        - Community
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
router.post("/tags/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");
    if (!req.query.tag) return res.status(404).send("Tag not found in query.");

    if (user.name !== community.creator)
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

    return res.sendStatus(204);
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
 *        - Community
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
router.delete("/tags/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");
    if (!req.query.tag) return res.status(404).send("Tag not found in query.");

    if (user.name !== community.creator)
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

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/flags/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Get community flags by community title
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/title"
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          description: Community successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community/properties/flags'
 *        '400':
 *          description: Bad Request.
 */

// Get community flags by community title
router.get("/flags/:title", async (req, res) => {
  try {
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!community) return res.status(404).send("Community not found.");

    return res.status(200).json(community.flags);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/flags/{title}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community
 *      summary: Flag community by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: Invalid flag. Use one of <br>[Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]
 *        '204':
 *          description: Successfully set flag.
 *        '400':
 *          description: Bad Request.
 */

// Flag community by community title
router.post("/flags/:title", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    // TODO: Set flags in an options collection, that can be edited by admins
    const flags = [
      "Inappropriate",
      "Hate",
      "Harassment or Bullying",
      "Spam",
      "Misinformation",
      "Against Community Rules",
    ];

    if (!flags.includes(req.query.flag))
      return res
        .status(403)
        .send(
          "Invalid flag. Use one of [Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]"
        );

    // If flag isn't set on community
    if (
      !(await Community.exists({
        title: community.title,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      await Community.updateOne(
        { title: community.title },
        { $push: { flags: { flag: req.query.flag, flaggedBy: [user.id] } } }
      );
    } else {
      // Add user to flaggedBy
      await Community.updateOne(
        {
          title: community.title,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [user.id] } }
      );
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
