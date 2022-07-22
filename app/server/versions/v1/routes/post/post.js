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
const checkUserIsMemberOfCommunity = require("../../functions/checkUserIsMemberOfCommunity");
const updateCommunityEngagement = require("../../functions/updateCommunityEngagement");
const getOptions = require("../../functions/getOptions");
const trimExtraSpaces = require("../../functions/trimExtraSpaces");
const validatePostInputs = require("../../functions/validatePostInputs");
const getFullName = require("../../functions/getFullName");
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

const router = express.Router();

const Community = require("../../models/community.model");
const Post = require("../../models/post.model");
const Comment = require("../../models/comment.model");
const User = require("../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/post:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Create post.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Post/properties/title'
 *                message:
 *                  $ref: '#/components/schemas/Post/properties/message'
 *                community:
 *                  $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: Community can't have more than 3 pinned posts. **||** <br>User must be a part of community. **||** <br>Only community moderators can set 'pinned' posts.
 *        '201':
 *          description: Post successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Create post
router.post("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.body.community,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction("Finding options.");
    const {
      titleMinLength,
      titleMaxLength,
      titleDisallowedCharacters,
      titleDisallowedStrings,
      messageMinLength,
      messageMaxLength,
      createCommunityEngagementWeight,
    } = await getOptions("post");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    if (req.body.title) req.body.title = trimExtraSpaces(req.body.title);
    req.log.addAction(`title trimmed: ${req.body.title}`);
    if (req.body.message) req.body.message = req.body.message.trim();
    req.log.addAction(`description trimmed: ${req.body.description}`);

    req.log.addAction("Validating inputs.");
    validatePostInputs(req.body, {
      titleMinLength,
      titleMaxLength,
      titleDisallowedCharacters,
      titleDisallowedStrings,
      messageMinLength,
      messageMaxLength,
    });
    req.log.addAction("Inputs valid.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(user, community.title);
    req.log.addAction("User is member of community.");

    req.log.addAction("Checking if pinned field is set in req body.");
    if (
      req.body.pinned &&
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only community moderators can set 'pinned' posts."
      );

    if (
      req.body.pinned === true &&
      (await Post.count({
        community: community.title,
        pinned: true,
      })) >= 3
    )
      throw new ResponseError(
        403,
        "Community can't have more than 3 pinned posts."
      );

    req.log.addAction("Getting available tags from community.");
    const availableTags = community.tags.map((tag) => tag.tag);

    req.log.addAction("Creating post.");
    const post = await Post.create({
      title: req.body.title,
      message: req.body.message,
      creator: user.id,
      creatorName: getFullName(user) || user.username,
      creatorUsername: user.username,
      community: req.body.community,
      pinned: req.body.pinned || false,
      removed: false,
      hidden: false,
      availableTags,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
    req.log.addAction("Post created.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
      community.title,
      createCommunityEngagementWeight || 1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction(
      `Updating community (${req.body.community}) latest activity.`
    );
    await Community.updateOne(
      { title: post.community },
      { $set: { latestActivity: moment().format("MMMM Do YYYY, h:mm:ss a") } }
    );
    req.log.addAction(
      `Community (${req.body.community}) latest activity updated.`
    );

    req.log.addAction("Updating user post count.");
    await User.updateOne({ _id: user.id }, { $inc: { postCount: 1 } });
    req.log.addAction("User post count updated.");

    req.log.setResponse(201, "Success");
    return res.status(201).json(post);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/post:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get all posts from communities user is apart of.
 *      description: Use optional query 'username' To show only posts by that user.
 *      parameters:
 *        - in: query
 *          required: false
 *          name: username
 *          schema:
 *            $ref: '#/components/schemas/User/properties/username'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Posts not found.
 *        '200':
 *          description: Posts successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  - $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get all posts from communities user is apart of
router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    const queryUser = req.query.username
      ? await User.findOne({ username: req.query.username })
      : null;

    // If post belongs to community listed in user.communities
    req.log.addAction("Finding communities user is member of.");
    const communities = user.communities.map(
      (community) => community.community
    );

    // If query param username is set, return only posts username has created
    let matchQuery = queryUser
      ? {
          community: { $in: communities },
          creator: queryUser.id,
          removed: false,
          $or: [{ hidden: false }, { hidden: null }],
        }
      : {
          community: { $in: communities },
          removed: false,
          $or: [{ hidden: false }, { hidden: null }],
        };

    if (user.role === "admin") {
      matchQuery = queryUser
        ? {
            community: { $in: communities },
            creator: queryUser.id,
          }
        : {
            community: { $in: communities },
          };
    }

    req.log.addAction("Communities found. Finding posts from communities.");
    const posts = await Post.find(matchQuery, "", {
      sort: { pinned: -1, _id: -1 },
    }).exec();

    if (!posts) throw new ResponseError(404, "Posts not found.");
    req.log.addAction("Posts found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(posts);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get post by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      responses:
 *        '404':
 *          description: Post not found.
 *        '200':
 *          description: Post successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get post by id
router.get("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding post.");
    const { post } = await findSingleDocuments(
      {
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("Post found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(post);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/community/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get all posts from community title.
 *      description: Optional query param 'tag' only returns posts tagged with 'tag'.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/title"
 *        - in: query
 *          required: false
 *          name: tag
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/tags/items/properties/tag"
 *      responses:
 *        '404':
 *          description: Posts not found. **||** <br>Community not found.
 *        '200':
 *          description: Posts successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get all posts from community title (Optional query param 'tag' only returns posts tagged with 'tag')
router.get("/community/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("Community found.");

    req.log.addAction(
      `Checking if user is moderator of community (${community.title}).`
    );
    const isModerator = await communityAuthorization.isCommunityModerator(
      user.username,
      community.title
    );

    let matchQuery = {};
    let posts;

    req.log.addAction("Checking tag query.");
    if (req.query.tag) {
      // Return community posts by tag set in query
      req.log.addAction("Finding posts in community with tag.");

      matchQuery = isModerator
        ? {
            community: community.title,
            removed: false,
            "tags.tag": req.query.tag,
          }
        : {
            community: community.title,
            "tags.tag": req.query.tag,
            removed: false,
            $or: [{ hidden: false }, { hidden: null }],
          };

      if (user.role === "admin")
        matchQuery = {
          community: community.title,
          "tags.tag": req.query.tag,
        };

      posts = await Post.find(matchQuery, "", {
        sort: { pinned: -1, _id: -1 },
      }).exec();
    } else {
      // Return all community posts
      req.log.addAction("Finding posts in community.");

      matchQuery = isModerator
        ? { community: community.title, removed: false }
        : {
            community: community.title,
            removed: false,
            $or: [{ hidden: false }, { hidden: null }],
          };

      if (user.role === "admin") matchQuery = { community: community.title };

      posts = await Post.find(matchQuery, "", {
        sort: { pinned: -1, _id: -1 },
      }).exec();
    }

    if (!posts) throw new ResponseError(404, "Posts not found.");
    req.log.addAction("Posts found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(posts);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/{id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Edit post by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Post/properties/title'
 *                message:
 *                  $ref: '#/components/schemas/Post/properties/message'
 *                pinned:
 *                  $ref: '#/components/schemas/Post/properties/pinned'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: Community can't have more than 3 pinned posts. **||** <br>One of the fields you tried to edit, can not be edited. **||** <br>Only creator of post can edit post.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Edit post by id
router.patch("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments(
      {
        user: req.user.username,
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and post found.");

    req.log.addAction("Finding options.");
    const options = await getOptions("post");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    if (req.body.title) req.body.title = trimExtraSpaces(req.body.title);
    req.log.addAction(`title trimmed: ${req.body.title}`);
    if (req.body.message) req.body.message = req.body.message.trim();
    req.log.addAction(`description trimmed: ${req.body.message}`);

    req.log.addAction("Validating inputs.");
    validatePostInputs(req.body, options, true);
    req.log.addAction("Inputs valid.");

    req.log.addAction("Checking if pinned field set in req body.");
    if (req.body.pinned === true) {
      // Trying to pin post
      req.log.addAction("Checking number of pinned posts in community.");
      if (
        (await Post.count({
          community: post.community,
          pinned: true,
        })) >= 3
      )
        throw new ResponseError(
          403,
          "Community can't have more than 3 pinned posts."
        );
    }

    req.log.addAction(
      `Checking if user is moderator of community (${post.community}).`
    );
    const isModerator = await communityAuthorization.isCommunityModerator(
      user.username,
      post.community
    );

    req.log.addAction("Checking user is creator of post or a moderator.");
    if (!(isModerator || post.creator === user.id || user.role === "admin"))
      throw new ResponseError(
        403,
        "Only creator of post or a moderator can edit post."
      );
    req.log.addAction("User is creator of post or a moderator.");

    const disallowedFields = isModerator
      ? [
          "creator",
          "creatorName",
          "creatorUsername",
          "community",
          "createdOn",
          "availableTags",
          "tags",
          "flags",
          "removed",
          "commentCount",
        ]
      : [
          "creator",
          "creatorName",
          "creatorUsername",
          "community",
          "createdOn",
          "availableTags",
          "hidden",
          "removed",
          "pinned",
          "tags",
          "flags",
          "commentCount",
        ];

    req.log.addAction("Checking edit query.");
    const query =
      user.role === "admin"
        ? req.body
        : checkPatchQuery(req.body, post, disallowedFields);
    req.log.addAction("Edit query has been cleaned.");
    req.log.addPatchQuery(query);

    // When removed is set to false (undoing the removal of the community)
    if (query.removed && query.removed === false && user.role === "admin") {
      // Bring back comments
      await Comment.updateMany(
        { community: post.community },
        { removed: false }
      ).exec();
    }

    req.log.addAction("Updating post with query.");
    await Post.updateOne({ _id: post.id }, query).exec();
    req.log.addAction("Post updated.");

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
 *  /api/post/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Remove post by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: Must be creator of post to delete post.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove post by id
router.delete("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments(
      {
        user: req.user.username,
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and post found.");

    req.log.addAction("Finding options.");
    const { createCommunityEngagementWeight } = await getOptions("post");
    req.log.addAction("Options found.");

    req.log.addAction("Checking user is creator of post.");
    if (!(post.creator === user.id || user.role === "admin"))
      throw new ResponseError(403, "Must be creator of post to delete post.");
    req.log.addAction("User is creator of post.");

    // Permanently delete data
    const purgeData =
      user.role === "admin" ? req.query.purge === "true" : false;

    // Remove the comments on post
    req.log.addAction("Removing comments on post.");
    if (purgeData) {
      await Comment.deleteMany({ post: post.id }).exec();
    } else {
      await Comment.updateMany({ post: post.id }, { removed: true }).exec();
    }
    req.log.addAction("Comments removed from post.");

    // Remove post
    req.log.addAction("Removing post.");
    if (purgeData) {
      await Post.deleteOne({ _id: post.id }).exec();
    } else {
      await Post.updateOne({ _id: post.id }, { removed: true }).exec();
    }
    req.log.addAction("Post removed.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
      post.community,
      -createCommunityEngagementWeight || -1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction("Updating user post count.");
    await User.updateOne({ _id: user.id }, { $inc: { postCount: -1 } });
    req.log.addAction("User post count updated.");

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
