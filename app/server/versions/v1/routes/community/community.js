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
const ResponseError = require("../../classes/responseError");

const checkPatchQuery = require("../../functions/checkPatchQuery");
const findSingleDocuments = require("../../functions/findSingleDocuments");
const updateCommunityEngagement = require("../../functions/updateCommunityEngagement");
const getOptions = require("../../functions/getOptions");
const trimExtraSpaces = require("../../functions/trimExtraSpaces");
const bulkNotify = require("../../functions/bulkNotify");
const validateCommunityInputs = require("../../functions/validateCommunityInputs");
const findCommunitiesByEngagement = require("../../functions/findCommunitiesByEngagement");
const getFullName = require("../../functions/getFullName");

const router = express.Router();

const Community = require("../../models/community.model");
const User = require("../../models/user.model");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

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
router.post("/", async (req, res, next) => {
  try {
    const frontendURI =
      process.env.REACT_APP_LOCAL_DEV === "true"
        ? `http://${process.env.FRONTEND_REF}:${process.env.FRONTEND_PORT}`
        : process.env.FRONTEND_REF;

    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
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
      resourcesMinLength,
      resourcesMaxLength,
      tagMinLength,
      tagMaxLength,
      tagDescriptionMinLength,
      tagDescriptionMaxLength,
      ruleMinLength,
      ruleMaxLength,
      ruleDescriptionMinLength,
      ruleDescriptionMaxLength,
      createCommunityEngagementWeight,
    } = await getOptions("community");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    if (req.body.title) req.body.title = trimExtraSpaces(req.body.title);
    if (req.body.description)
      req.body.description = trimExtraSpaces(req.body.description);
    req.log.addAction(
      `Extra spaces trimmed. title: ${req.body.title}, description: ${req.body.description}`
    );

    req.log.addAction("Validating inputs.");
    validateCommunityInputs(req.body, {
      titleMinLength,
      titleMaxLength,
      titleDisallowedCharacters,
      titleDisallowedStrings,
      descriptionMinLength,
      descriptionMaxLength,
      resourcesMinLength,
      resourcesMaxLength,
      tagMinLength,
      tagMaxLength,
      tagDescriptionMinLength,
      tagDescriptionMaxLength,
      ruleMinLength,
      ruleMaxLength,
      ruleDescriptionMinLength,
      ruleDescriptionMaxLength,
    });
    req.log.addAction("Inputs valid.");

    req.log.addAction("Checking community already exists.");
    if (await Community.exists({ title: req.body.title }))
      throw new ResponseError(403, "Community already exists.");

    const timeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");

    req.log.addAction("Creating community.");
    const community = await Community.create({
      title: req.body.title,
      description: req.body.description || "",
      resources: req.body.resources || "",
      creator: user.id,
      creatorName: getFullName(user) || user.username,
      creatorUsername: user.username,
      memberCount: 1,
      flagCount: 0,
      latestFlagTimestamp: null,
      postCount: 0,
      removed: false,
      members: [user.id],
      rules: req.body.rules,
      tags: req.body.tags,
      createdOn: timeStamp,
      latestActivity: timeStamp,
      moderators: [
        {
          userId: user.id,
          name: getFullName(user),
          username: user.username,
          permissions: [
            "set_moderators",
            "set_permissions",
            "remove_community",
          ],
        },
      ],
    });
    req.log.addAction("Community created.");

    req.log.addAction("Updating user community list.");
    await User.updateOne(
      { username: user.username },
      {
        $addToSet: {
          communities: { community: req.body.title },
        },
      }
    );
    req.log.addAction("User community list updated.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
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
            _id: { $ne: community.creator },
          }
        : {
            notificationFrequency: "immediate",
            _id: { $ne: community.creator },
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
            row: ["$email", "$name", community.title, frontendURI],
          },
        },
      ]);
      notifyUsers = notifyUsers.map(({ row }) => row);
      notifyUsers.unshift(["email address", "name", "community", "url"]);
      if (notifyUsers.length > 1) {
        bulkNotify(
          notifyUsers,
          process.env.GC_NOTIFY_NEW_COMMUNITY_INSTANT_TEMPLATE
        );
      }
      req.log.addAction("Users have been notified with gcNotify (immediate).");
    }

    req.log.setResponse(201, "Success");
    return res.status(201).json(community);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    let communities;

    req.log.addAction("Checking orderBy query.");
    let matchQuery =
      user.role === "admin"
        ? { members: user.id }
        : { members: user.id, removed: false };
    if (req.query.orderBy === "lastJoined") {
      // Ordered by last joined
      req.log.addAction("Ordering by last joined. Finding communities.");
      communities = await Community.find(matchQuery, "", {
        sort: { _id: -1 },
      }).exec();
    } else if (req.query.orderBy === "engagement") {
      // Order by engagment (posts, comments, votes)
      req.log.addAction("Ordering by engagement. Finding communities.");
      communities = await findCommunitiesByEngagement(user);
    } else if (req.query.orderBy === "latestActivity") {
      // Order by latestActivity, only communities user is a member of.
      req.log.addAction("Ordering by latestActivity. Finding communities.");
      communities = await Community.find(matchQuery, "", {
        sort: { latestActivity: -1 },
      }).exec();
    } else {
      // Ordered by last created
      req.log.addAction("Ordering by last created. Finding communities.");
      matchQuery = user.role === "admin" ? {} : { removed: false };
      communities = await Community.find({ removed: false }, "", {
        sort: { _id: -1 },
      }).exec();
    }

    if (!communities) throw new ResponseError(404, "Communities not found.");
    req.log.addAction("Communities found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(communities);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.get("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding community.");
    const { community } = await findSingleDocuments(
      {
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("Community found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(community);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.patch("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction("Finding options.");
    const options = await getOptions("community");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    if (req.body.title) req.body.title = trimExtraSpaces(req.body.title);
    if (req.body.description)
      req.body.description = req.body.description.trim();
    req.log.addAction(
      `Extra spaces trimmed. title: ${req.body.title}, description: ${req.body.description}`
    );

    req.log.addAction("Validating inputs.");
    validateCommunityInputs(req.body, options, true);
    req.log.addAction("Inputs valid.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderator of community can edit community."
      );
    req.log.addAction("User is moderator of community.");

    req.log.addAction("Checking if community title already exists.");
    if (req.body.title && (await Community.exists({ title: req.body.title })))
      throw new ResponseError(403, "Community already exists with that title.");
    req.log.addAction("Community title does not already exist.");

    req.log.addAction("Checking edit query.");
    const query =
      user.role === "admin"
        ? req.body
        : checkPatchQuery(req.body, community, [
            "tags",
            "flags",
            "createdOn",
            "members",
            "creator",
            "creatorName",
            "creatorUsername",
            "memberCount",
            "postCount",
            "latestActivity",
            "moderators",
            "removed",
            "flagCount",
          ]);
    req.log.addAction("Edit query has been cleaned.");
    req.log.addPatchQuery(query);

    // When removed is set to false (undoing the removal of the community)
    if (query.removed && query.removed === false && user.role === "admin") {
      // Add community back to users community lists
      req.log.addAction("Adding community to users community lists.");
      await User.updateMany(
        { communities: { $elemMatch: { community: community.title } } },
        { "communities.$.removed": false }
      ).exec();

      // Bring back posts
      await Post.updateMany(
        { community: community.title },
        { removed: false }
      ).exec();

      // Bring back comments
      await Comment.updateMany(
        { community: community.title },
        { removed: false }
      ).exec();
    }

    req.log.addAction("Updating community.");
    await Community.updateOne({ title: community.title }, query).exec();
    req.log.addAction("Community updated.");

    if (req.body.title) {
      req.log.addAction("Updating posts in community.");
      await Post.updateMany(
        { community: community.title },
        { $set: { community: query.title } }
      ).exec();
      req.log.addAction("Community posts updated.");

      req.log.addAction("Updating user community lists.");
      await User.updateMany(
        { communities: { $elemMatch: { community: community.title } } },
        { $set: { "communities.$.community": query.title } }
      ).exec();
      req.log.addAction("User community lists updated.");
    }

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
 *          description: Only moderators of community with 'remove_community' permission can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove community by title
router.delete("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title,
          ["remove_community"]
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderators of community with 'remove_community' permission can edit community."
      );
    req.log.addAction("User is moderator of community.");

    // Permanently delete data
    const purgeData =
      user.role === "admin" ? req.query.purge === "true" : false;

    // Remove community
    req.log.addAction("Removing community.");
    if (purgeData) {
      await Community.deleteOne({ title: req.params.title }).exec();
    } else {
      await Community.updateOne(
        { title: req.params.title },
        { removed: true }
      ).exec();
    }
    req.log.addAction("Community removed.");

    // Remove reference to community from users
    req.log.addAction("Removing community from user community lists.");
    if (purgeData) {
      await User.deleteMany({
        "communities.community": community.title,
      }).exec();
    } else {
      await User.updateMany(
        { communities: { $elemMatch: { community: community.title } } },
        { "communities.$.removed": true }
      ).exec();
    }
    req.log.addAction("Community removed from user community lists.");

    // Remove posts from community
    req.log.addAction("Removing posts from community.");
    if (purgeData) {
      await Post.deleteMany({ community: community.title }).exec();
    } else {
      await Post.updateMany(
        { community: community.title },
        { removed: true }
      ).exec();
    }
    req.log.addAction("Posts removed from community.");

    // Remove comments from posts in community
    req.log.addAction("Removing comments from community.");
    if (purgeData) {
      await Comment.deleteMany({ community: community.title }).exec();
    } else {
      await Comment.updateMany(
        { community: community.title },
        { removed: true }
      ).exec();
    }
    req.log.addAction("Comments removed from community.");

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
