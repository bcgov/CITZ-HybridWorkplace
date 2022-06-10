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
const { ObjectId } = require("mongodb");
const ResponseError = require("../../../responseError");

const checkPatchQuery = require("../../../functions/checkPatchQuery");
const findSingleDocuments = require("../../../functions/findSingleDocuments");
const updateCommunityEngagement = require("../../../functions/updateCommunityEngagement");

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
 *                tags:
 *                  $ref: '#/components/schemas/Community/properties/tags'
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
    const documents = await findSingleDocuments({
      user: req.user.username,
    });

    if (await Community.exists({ title: req.body.title })) {
      throw new ResponseError(403, "Community already exists.");
    }

    // TODO: Validate formatting for tags in request body
    // TODO: Prevent spaces or special characters in community title

    const community = await Community.create({
      title: req.body.title,
      description: req.body.description,
      creator: documents.user.username,
      members: [documents.user.id],
      rules: req.body.rules,
      tags: req.body.tags,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });

    await updateCommunityEngagement(
      documents.user.username,
      community.title,
      process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMUNITY || 0
    );

    return res.status(201).json(community);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
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
    const documents = await findSingleDocuments({
      user: req.user.username,
    });

    let communities;

    if (req.query.orderBy === "lastJoined") {
      // Ordered by last joined
      communities = await Community.find({ members: documents.user.id }, "", {
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
            members: new ObjectId(documents.user.id),
          },
        },
        { $sort: { engagement: -1, _id: -1 } },
      ]).exec();
    } else {
      // Ordered by first created
      communities = await Community.find({}, "", { sort: { _id: 1 } }).exec();
    }

    if (!communities) throw new ResponseError(404, "Communities not found.");

    return res.status(200).json(communities);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
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
    const documents = await findSingleDocuments({
      community: req.params.title,
    });

    return res.status(200).json(documents.community);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
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
 *        '403':
 *          description: One of the fields you tried to edit, can not be edited. **||** <br>Only creator of community can edit community. **||** <br>Community already exists with that title.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Edit community by title
// TODO: AUTH
router.patch("/:title", async (req, res) => {
  try {
    // TODO: AUTH USER IS MODERATOR
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    if (documents.user.username !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );

    // TODO: Prevent spaces or special characters in community title

    if (req.body.title && (await Community.exists({ title: req.body.title })))
      throw new ResponseError(403, "Community already exists with that title.");

    const query = checkPatchQuery(req.body, documents.community, [
      "tags",
      "flags",
      "createdOn",
      "members",
      "creator",
    ]);

    await Community.updateOne(
      { title: documents.community.title },
      query
    ).exec();

    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
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
 *        '403':
 *          description: Only creator of community can edit community.
 *        '200':
 *          description: Community removed.
 *        '400':
 *          description: Bad Request.
 */

// Remove community by title
// TODO: AUTH moderators
router.delete("/:title", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    if (documents.user.username !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );

    // Remove community
    await Community.deleteOne({
      title: req.params.title,
    }).exec();

    // Remove reference to community from users
    await User.updateMany(
      { "communities.community": documents.community.title },
      { $pull: { communities: { community: documents.community.title } } }
    ).exec();

    // Remove posts from community
    await Post.deleteMany({ community: documents.community.title }).exec();

    // Remove comments from posts in community
    await Comment.deleteMany({ community: documents.community.title }).exec();

    return res.status(200).send("Community removed.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
