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
const ResponseError = require("../../../responseError");

const checkPatchQuery = require("../../../functions/checkPatchQuery");
const findSingleDocuments = require("../../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../../functions/checkUserIsMemberOfCommunity");
const updateCommunityEngagement = require("../../../functions/updateCommunityEngagement");

const router = express.Router();

const Community = require("../../../models/community.model");
const Post = require("../../../models/post.model");
const Comment = require("../../../models/comment.model");
const User = require("../../../models/user.model");

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
 *          description: Community can't have more than 3 pinned posts. **||** <br>User must be a part of community.
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
router.post("/", async (req, res) => {
  try {
    req.log.addAction("Finding user and community.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.body.community,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(
      documents.user.username,
      documents.community.title
    );
    req.log.addAction("User is member of community.");

    req.log.addAction("Checking if pinned field is set in req body.");
    if (
      req.body.pinned === true &&
      (await Post.count({
        community: documents.community.title,
        pinned: true,
      })) >= 3
    )
      throw new ResponseError(
        403,
        "Community can't have more than 3 pinned posts."
      );

    req.log.addAction("Getting available tags from community.");
    const availableTags = documents.community.tags.map((tag) => tag.tag);

    req.log.addAction("Getting creator name.");
    const { firstName, lastName } = documents.user;
    let creatorName;

    if (firstName && firstName !== "") {
      // If lastName, set full name, else just firstName
      creatorName =
        lastName && lastName !== "" ? `${firstName} ${lastName}` : firstName;
    }

    req.log.addAction("Creating post.");
    const post = await Post.create({
      title: req.body.title,
      message: req.body.message,
      creator: documents.user.id,
      creatorName: creatorName || documents.user.username,
      community: req.body.community,
      pinned: req.body.pinned || false,
      availableTags,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
    req.log.addAction("Post created.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      documents.user.username,
      documents.community.title,
      process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_POST || 1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction("Updating community latest activity.");
    await Community.updateOne(
      { title: post.community },
      { $set: { latestActivity: moment().format("MMMM Do YYYY, h:mm:ss a") } }
    );
    req.log.addAction("Community latest activity updated.");

    req.log.addAction("Updating user post count.");
    await User.updateOne(
      { _id: documents.user.id },
      { $inc: { postCount: 1 } }
    );
    req.log.addAction("User post count updated.");

    req.log.setResponse(201, "Success", null);
    return res.status(201).json(post);
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
 *  /api/post:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get all posts from communities user is apart of.
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
router.get("/", async (req, res) => {
  try {
    req.log.addAction("Finding user.");
    const documents = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    // If post belongs to community listed in user.communities
    req.log.addAction("Finding communities user is member of.");
    const communities = documents.user.communities.map(
      (community) => community.community
    );
    req.log.addAction("Communities found. Finding posts from communities.");
    const posts = await Post.find({ community: { $in: communities } }, "", {
      sort: { pinned: -1, _id: -1 },
    }).exec();

    if (!posts) throw new ResponseError(404, "Posts not found.");
    req.log.addAction("Posts found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(posts);
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
router.get("/:id", async (req, res) => {
  try {
    req.log.addAction("Finding post.");
    const documents = await findSingleDocuments({
      post: req.params.id,
    });
    req.log.addAction("Post found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(documents.post);
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
router.get("/community/:title", async (req, res) => {
  try {
    req.log.addAction("Finding community.");
    const documents = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    let posts;

    req.log.addAction("Checking tag query.");
    if (req.query.tag) {
      // Return community posts by tag set in query
      req.log.addAction("Finding posts in community with tag.");
      posts = await Post.find(
        { community: documents.community.title, "tags.tag": req.query.tag },
        "",
        {
          sort: { pinned: -1, _id: -1 },
        }
      ).exec();
    } else {
      // Return all community posts
      req.log.addAction("Finding posts in community.");
      posts = await Post.find({ community: documents.community.title }, "", {
        sort: { pinned: -1, _id: -1 },
      }).exec();
    }

    if (!posts) throw new ResponseError(404, "Posts not found.");
    req.log.addAction("Posts found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(posts);
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
router.patch("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN EDIT POST TOO
    req.log.addAction("Finding user and post.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });
    req.log.addAction("User and post found.");

    req.log.addAction("Checking user is creator of post.");
    if (documents.post.creator !== documents.user.id)
      throw new ResponseError(403, "Only creator of post can edit post.");
    req.log.addAction("User is creator of post.");

    req.log.addAction("Checking if pinned field set in req body.");
    if (req.body.pinned === true) {
      // Trying to pin post
      req.log.addAction("Checking number of pinned posts in community.");
      if (
        (await Post.count({
          community: documents.post.community,
          pinned: true,
        })) >= 3
      )
        throw new ResponseError(
          403,
          "Community can't have more than 3 pinned posts."
        );
    }

    req.log.addAction("Checking edit query.");
    const query = checkPatchQuery(req.body, documents.post, [
      "creator",
      "community",
      "createdOn",
      "availableTags",
      "tags",
      "flags",
      "commentCount",
    ]);
    req.log.addAction("Edit query has been cleaned.");

    req.log.addAction("Updating post with query.");
    await Post.updateOne({ _id: documents.post.id }, query).exec();
    req.log.addAction("Post updated.");

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
router.delete("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN DELETE POST TOO
    req.log.addAction("Finding user and post.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });
    req.log.addAction("User and post found.");

    req.log.addAction("Checking user is creator of post.");
    if (documents.post.creator !== documents.user.id)
      throw new ResponseError(403, "Must be creator of post to delete post.");
    req.log.addAction("User is creator of post.");

    // Remove the comments on post
    req.log.addAction("Removing comments on post.");
    await Comment.deleteMany({ post: documents.post.id }).exec();
    req.log.addAction("Comments removed from post.");

    // Remove post
    req.log.addAction("Removing post.");
    await Post.deleteOne({
      _id: documents.post.id,
    }).exec();
    req.log.addAction("Post removed.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      documents.user.username,
      documents.post.community,
      -process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_POST || -1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction("Updating user post count.");
    await User.updateOne(
      { _id: documents.user.id },
      { $inc: { postCount: -1 } }
    );
    req.log.addAction("User post count updated.");

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
