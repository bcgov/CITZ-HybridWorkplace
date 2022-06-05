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
const moment = require("moment");
const ObjectId = require("mongodb").ObjectId;

const router = express.Router();

const Community = require("../../../models/community.model");
const User = require("../../../models/user.model");
const Post = require("../../../models/post.model");
const Comment = require("../../../models/comment.model");

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
    const user = await User.findOne({ username: req.user.username });

    if (!user) return res.status(404).send("User not found.");

    if (await Community.exists({ title: req.body.title })) {
      return res.status(403).send("Community already exists.");
    }

    const community = await Community.create({
      title: req.body.title,
      description: req.body.description,
      creator: user.username,
      members: [user.id],
      rules: req.body.rules,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      tags: req.body.tags,
    });

    await User.updateOne(
      { username: user.username },
      {
        $push: {
          communities: {
            community: community.title,
            engagement:
              process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMUNITY || 0,
          },
        },
      }
    );

    return res.status(201).json(community);
  } catch (err) {
    console.log(err);
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
 *      summary: Get all communities or only communities user is a part of.
 *      description: Use optional query 'orderBy' with<br>'lastJoined' - Communities user has joined, in the order of last joined first.<br>'engagement' - Communities user has joined, in the order of most engagement.
 *      parameters:
 *        - in: query
 *          required: false
 *          name: orderBy
 *          schema:
 *            type: string
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Communities not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  - $ref: '#/components/schemas/Community'
 *        '400':
 *          description: Bad Request.
 */

// Get all communities or all communities user is a part of
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.status(404).send("User not found.");

    let communities;

    if (req.query.orderBy === "lastJoined") {
      // Ordered by last joined
      communities = await Community.find({ members: user.id }, "", {
        sort: { _id: -1 },
      }).exec();
    } else if (req.query.orderBy === "engagement") {
      // Order by engagment (posts, comments, votes)
      communities = await Community.aggregate([
        {
          $lookup: {
            from: "user",
            let: { community_title: "$title" },
            pipeline: [
              {
                $unwind: "$communities",
              },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$communities.community", "$$community_title"] },
                    ],
                  },
                },
              },
            ],
            as: "userData",
          },
        },
        {
          $addFields: {
            engagement: {
              $ifNull: [{ $sum: ["$userData.communities.engagement"] }, 0],
            },
          },
        },
        {
          $project: {
            userData: 0,
          },
        },
        { $unwind: "$members" },
        {
          $match: {
            members: new ObjectId(user.id),
          },
        },
        { $sort: { engagement: -1, _id: -1 } },
      ]).exec();
    } else {
      // Ordered by first created
      communities = await Community.find({}, "", { sort: { _id: 1 } }).exec();
    }

    if (!communities) return res.status(404).send("Communities not found.");

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
 *        '403':
 *          description: One of the fields you tried to edit, can not be edited.
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
    const user = await User.findOne({ username: req.user.username });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    if (user.username !== community.creator)
      return res
        .status(401)
        .send("Not Authorized. Only creator of community can edit community.");

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      if (
        key === "tags" ||
        key === "flags" ||
        key === "createdOn" ||
        key === "members"
      )
        return res
          .status(403)
          .send("One of the fields you tried to edit, can not be edited.");
      // if the field in req.body exists, update/set it
      if (community[key] && community[key] !== req.body[key]) {
        query.$set[key] = req.body[key];
      } else if (!community[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await Community.updateOne({ title: community.title }, query).exec();

    return res.status(204).send("");
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
    const user = await User.findOne({ username: req.user.username });
    const community = await Community.findOne({
      title: req.params.title,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    if (user.username !== community.creator)
      return res
        .status(401)
        .send("Not Authorized. Only creator of community can edit community.");

    // Remove community
    await Community.deleteOne({
      title: req.params.title,
    }).exec();

    // Remove reference to community from users
    await User.updateMany(
      { "communities.community": community.title },
      { $pull: { communities: { community: community.title } } }
    ).exec();

    // Remove posts from community
    await Post.deleteMany({ community: community.title }).exec();

    // Remove comments from posts in community
    await Comment.deleteMany({ community: community.title }).exec();

    // TODO: AUTH ONLY MODERATORS OF COMMUNITY
    return res.status(200).send("Community removed.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
