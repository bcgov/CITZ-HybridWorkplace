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
const getOptions = require("../../../functions/getOptions");
const trimExtraSpaces = require("../../../functions/trimExtraSpaces");
const bulkNotify = require("../../../functions/bulkNotify");

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
    req.log.addAction("Finding user.");
    const documents = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    req.log.addAction("Finding options.");
    const {
      titleMinLength,
      titleMaxLength,
      titleDisallowedCharacters,
      titleDisallowedStrings,
      descriptionMinLength,
      descriptionMaxLength,
      tagMinLength,
      tagMaxLength,
      createCommunityEngagementWeight,
    } = await getOptions("community");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    req.body.title = trimExtraSpaces(req.body.title);
    req.log.addAction(`title trimmed: ${req.body.title}`);
    req.body.description = trimExtraSpaces(req.body.description);
    req.log.addAction(`description trimmed: ${req.body.description}`);

    // Validate title
    const titleRegexStr = `(?!.*[${titleDisallowedCharacters}]).{${titleMinLength},${titleMaxLength}}`;
    const titlePattern = new RegExp(titleRegexStr, "g");
    const titleDisallowedCharactersReplace = titleDisallowedCharacters
      .replace(/^\\/g, "x")
      .replaceAll("\\", "")
      .replace("x", "\\");
    const titleError = `title does not meet requirements: length ${titleMinLength}-${titleMaxLength}, must not contain characters (${titleDisallowedCharactersReplace}).`;
    req.log.addAction("Validating title.");
    if (!titlePattern.test(req.body.title))
      throw new ResponseError(403, titleError);

    titleDisallowedStrings.some((str) => {
      const pattern = new RegExp(str, "g");
      if (pattern.test(req.body.title))
        throw new ResponseError(403, `Invalid string in title: ${str}`);
      return true;
    });
    req.log.addAction("title is valid.");

    // Validate description
    const descriptionError = `description does not meet requirements: length ${descriptionMinLength}-${descriptionMaxLength}.`;
    req.log.addAction("Validating description.");
    if (
      !req.body.description ||
      req.body.description.length < descriptionMinLength ||
      req.body.description.length > descriptionMaxLength
    )
      throw new ResponseError(403, descriptionError);
    req.log.addAction("description is valid.");

    // TODO: Validate tag desc once implemented
    // Validate and trim tags
    if (req.body.tags && req.body.tags instanceof Object) {
      Object.keys(req.body.tags).forEach((tagObject) => {
        // Trim extra spaces
        req.body.tags[tagObject].tag = trimExtraSpaces(
          req.body.tags[tagObject].tag
        );
        // Validate length
        if (
          req.body.tags[tagObject].tag.length < tagMinLength ||
          req.body.tags[tagObject].tag.length > tagMaxLength
        )
          throw new ResponseError(
            403,
            `Tags (${req.body.tags[tagObject].tag}) must have a length of ${tagMinLength}-${tagMaxLength}`
          );
      });
    }

    // TODO: Validate rules when rules have been reworked to use a list

    req.log.addAction("Checking community already exists.");
    if (await Community.exists({ title: req.body.title }))
      throw new ResponseError(403, "Community already exists.");

    req.log.addAction("Getting creator name.");
    const { firstName, lastName } = documents.user;
    let creatorName;

    if (firstName && firstName !== "") {
      // If lastName, set full name, else just firstName
      creatorName =
        lastName && lastName !== "" ? `${firstName} ${lastName}` : firstName;
    }

    const timeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");

    req.log.addAction("Creating community.");
    const community = await Community.create({
      title: req.body.title,
      description: req.body.description,
      creator: documents.user.id,
      creatorName: creatorName || documents.user.username,
      memberCount: 1,
      members: [documents.user.id],
      rules: req.body.rules,
      tags: req.body.tags,
      createdOn: timeStamp,
      latestActivity: timeStamp,
    });
    req.log.addAction("Community created.");

    req.log.addAction("Updating user community list.");
    await User.updateOne(
      { username: documents.user.username },
      {
        $addToSet: {
          communities: { community: req.body.title },
        },
      }
    );
    req.log.addAction("User community list updated.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      documents.user.username,
      community.title,
      createCommunityEngagementWeight || 0
    );
    req.log.addAction("Community engagement updated.");

    // gcNotify immediate
    if (process.env.ENABLE_GC_NOTIFY) {
      const notifyMatchQuery = process.env.ENABLE_GC_NOTIFY_TRIAL_MODE
        ? {
            notificationFrequency: "immediate",
            isInMailingList: true,
            _id: { $ne: new ObjectId(community.creator) },
          }
        : {
            notificationFrequency: "immediate",
            _id: { $ne: new ObjectId(community.creator) },
          };
      req.log.addAction("Notifying users with gcNotify (immediate).");
      let notifyUsers = await User.aggregate([
        { $match: notifyMatchQuery },
        {
          $addFields: {
            name: {
              $ifNull: ["$firstName", "$username"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            row: ["$email", "$name", community.title, community.description],
          },
        },
      ]);
      notifyUsers = notifyUsers.map(({ row }) => row);
      notifyUsers.unshift([
        "email address",
        "name",
        "community",
        "communityDescription",
      ]);
      bulkNotify(
        notifyUsers,
        process.env.GC_NOTIFY_NEW_COMMUNITY_INSTANT_TEMPLATE
      );
      req.log.addAction("Users have been notified with gcNotify (immediate).");
    }

    req.log.setResponse(201, "Success", null);
    return res.status(201).json(community);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
 *      description: Use optional query 'orderBy' with<br>'lastJoined' - Communities user has joined, in the order of last joined first.<br>'engagement' - Communities user has joined, in the order of most engagement.<br>'latestActivity' - Communities user has joined, in the order of latestActivity.
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
    req.log.addAction("Finding user.");
    const documents = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    let communities;

    req.log.addAction("Checking orderBy query.");
    if (req.query.orderBy === "lastJoined") {
      // Ordered by last joined
      req.log.addAction("Ordering by last joined. Finding communities.");
      communities = await Community.find({ members: documents.user.id }, "", {
        sort: { _id: -1 },
      }).exec();
    } else if (req.query.orderBy === "engagement") {
      // Order by engagment (posts, comments, votes)
      req.log.addAction("Ordering by engagement. Finding communities.");
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
    } else if (req.query.orderBy === "latestActivity") {
      // Order by latestActivity, only communities user is a member of.
      req.log.addAction("Ordering by latestActivity. Finding communities.");
      communities = await Community.find({ members: documents.user.id }, "", {
        sort: { latestActivity: -1 },
      }).exec();
    } else {
      // Ordered by last created
      req.log.addAction("Ordering by last created. Finding communities.");
      communities = await Community.find({}, "", {
        sort: { _id: -1 },
      }).exec();
    }

    if (!communities) throw new ResponseError(404, "Communities not found.");
    req.log.addAction("Communities found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(communities);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
    req.log.addAction("Finding community.");
    const documents = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(documents.community);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
    req.log.addAction("Finding user and community.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Finding options.");
    const {
      titleMinLength,
      titleMaxLength,
      titleDisallowedCharacters,
      titleDisallowedStrings,
      descriptionMinLength,
      descriptionMaxLength,
      tagMinLength,
      tagMaxLength,
    } = await getOptions("community");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    req.body.title = trimExtraSpaces(req.body.title);
    req.log.addAction(`title trimmed: ${req.body.title}`);
    req.body.description = trimExtraSpaces(req.body.description);
    req.log.addAction(`description trimmed: ${req.body.description}`);

    // Validate title
    const titleRegexStr = `(?!.*[${titleDisallowedCharacters}]).{${titleMinLength},${titleMaxLength}}`;
    const titlePattern = new RegExp(titleRegexStr, "g");
    const titleDisallowedCharactersReplace = titleDisallowedCharacters
      .replace(/^\\/g, "x")
      .replaceAll("\\", "")
      .replace("x", "\\");
    const titleError = `title does not meet requirements: length ${titleMinLength}-${titleMaxLength}, must not contain characters (${titleDisallowedCharactersReplace}).`;
    req.log.addAction("Validating title.");
    if (!titlePattern.test(req.body.title))
      throw new ResponseError(403, titleError);

    titleDisallowedStrings.some((str) => {
      const pattern = new RegExp(str, "g");
      if (pattern.test(req.body.title))
        throw new ResponseError(403, `Invalid string in title: ${str}`);
      return true;
    });
    req.log.addAction("title is valid.");

    // Validate description
    const descriptionError = `description does not meet requirements: length ${descriptionMinLength}-${descriptionMaxLength}.`;
    req.log.addAction("Validating description.");
    if (
      !req.body.description ||
      req.body.description.length < descriptionMinLength ||
      req.body.description.length > descriptionMaxLength
    )
      throw new ResponseError(403, descriptionError);
    req.log.addAction("description is valid.");

    // TODO: Validate tag desc once implemented
    // Validate and trim tags
    if (req.body.tags && req.body.tags instanceof Object) {
      Object.keys(req.body.tags).forEach((tagObject) => {
        // Trim extra spaces
        req.body.tags[tagObject].tag = trimExtraSpaces(
          req.body.tags[tagObject].tag
        );
        // Validate length
        if (
          req.body.tags[tagObject].tag.length < tagMinLength ||
          req.body.tags[tagObject].tag.length > tagMaxLength
        )
          throw new ResponseError(
            403,
            `Tags (${req.body.tags[tagObject].tag}) must have a length of ${tagMinLength}-${tagMaxLength}`
          );
      });
    }

    // TODO: Validate rules when rules have been reworked to use a list

    req.log.addAction("Checking user is creator of community.");
    if (documents.user.id !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );
    req.log.addAction("User is creator of community.");

    req.log.addAction("Checking if community title already exists.");
    if (req.body.title && (await Community.exists({ title: req.body.title })))
      throw new ResponseError(403, "Community already exists with that title.");
    req.log.addAction("Community title does not already exist.");

    req.log.addAction("Checking edit query.");
    const query = checkPatchQuery(req.body, documents.community, [
      "tags",
      "flags",
      "createdOn",
      "members",
      "creator",
      "creatorName",
      "memberCount",
      "latestActivity",
    ]);
    req.log.addAction("Edit query has been cleaned.");

    req.log.addAction("Updating community.");
    await Community.updateOne(
      { title: documents.community.title },
      query
    ).exec();
    req.log.addAction("Community updated.");

    req.log.addAction("Updating posts in community.");
    await Post.updateMany(
      { community: documents.community.title },
      { $set: { community: req.body.title } }
    ).exec();
    req.log.addAction("Community posts updated.");

    req.log.addAction("Updating user community lists.");
    await User.updateMany(
      { communities: { $elemMatch: { community: documents.community.title } } },
      { $set: { "communities.$.community": req.body.title } }
    ).exec();
    req.log.addAction("User community lists updated.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove community by title
// TODO: AUTH moderators
router.delete("/:title", async (req, res) => {
  try {
    req.log.addAction("Finding user and community.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking user is creator of community.");
    if (documents.user.id !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );
    req.log.addAction("User is creator of community.");

    // Remove community
    req.log.addAction("Removing community.");
    await Community.deleteOne({
      title: req.params.title,
    }).exec();
    req.log.addAction("Community removed.");

    // Remove reference to community from users
    req.log.addAction("Removing community from user community lists.");
    await User.updateMany(
      { "communities.community": documents.community.title },
      { $pull: { communities: { community: documents.community.title } } }
    ).exec();
    req.log.addAction("Community removed from user community lists.");

    // Remove posts from community
    req.log.addAction("Removing posts from community.");
    await Post.deleteMany({ community: documents.community.title }).exec();
    req.log.addAction("Posts removed from community.");

    // Remove comments from posts in community
    req.log.addAction("Removing comments from community.");
    await Comment.deleteMany({ community: documents.community.title }).exec();
    req.log.addAction("Comments removed from community.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
  }
});

module.exports = router;
