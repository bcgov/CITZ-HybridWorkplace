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

const Comment = require("../../../models/comment.model");

/**
 * @swagger
 * paths:
 *  /api/comment:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment
 *      summary: Create comment.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  $ref: '#/components/schemas/Comment/properties/message'
 *                post:
 *                  $ref: '#/components/schemas/Post/properties/id'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: Missing message in body of the request. **||** <br>User must be a part of community.
 *        '201':
 *          description: Comment successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 *        '400':
 *          description: Bad Request.
 */

// Create comment
router.post("/", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.body.post,
    });

    await checkUserIsMemberOfCommunity(
      documents.user.username,
      documents.post.community
    );

    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    const comment = await Comment.create({
      message: req.body.message,
      creator: documents.user.id,
      post: documents.post.id,
      community: documents.post.community,
      "upvotes.count": 0,
      "downvotes.count": 0,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });

    await updateCommunityEngagement(
      documents.user.username,
      documents.post.community,
      process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMENT || 1
    );

    return res.status(201).json(comment);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/comment/post/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment
 *      summary: Get all comments from post id, excluding replies.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found. **||** <br>Comments not found.
 *        '200':
 *          description: Comments successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  - $ref: '#/components/schemas/Comment'
 *        '400':
 *          description: Bad Request.
 */

// Get all comments from post id, excluding replies
router.get("/post/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });

    const comments = await Comment.aggregate([
      { $match: { post: documents.post.id, replyTo: null } },
      {
        $addFields: {
          votes: {
            $ifNull: [{ $subtract: ["$upvotes.count", "$downvotes.count"] }, 0],
          },
        },
      },
      { $sort: { votes: -1, _id: 1 } },
    ]).exec();

    if (!comments) throw new ResponseError(404, "Comments not found.");

    return res.status(200).json(comments);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/comment/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment
 *      summary: Get comment by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Comment/properties/id"
 *      responses:
 *        '404':
 *          description: Comment not found.
 *        '200':
 *          description: Comment successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 *        '400':
 *          description: Bad Request.
 */

// Get comment by id
router.get("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      comment: req.params.id,
    });

    return res.status(200).json(documents.comment);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/comment/{id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment
 *      summary: Edit comment by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Comment/properties/id"
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  $ref: '#/components/schemas/Comment/properties/message'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Comment not found.
 *        '403':
 *          description: Missing message in body of the request. **||** <br>Only creator of comment can edit comment. **||** <br>Can only edit the message of a comment.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Edit comment by id
router.patch("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });

    if (documents.comment.creator !== documents.user.id)
      throw new ResponseError(403, "Only creator of comment can edit comment.");
    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    const query = checkPatchQuery(req.body, documents.community, [
      "creator",
      "post",
      "community",
      "createdOn",
      "replyTo",
      "hasReplies",
      "edits",
      "upvotes",
      "downvotes",
    ]);

    // Edit history
    await Comment.updateOne(
      { _id: req.params.id },
      {
        $push: {
          edits: {
            precursor: documents.comment.message,
            timeStamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
          },
        },
      }
    ).exec();

    await Comment.updateOne({ _id: req.params.id }, query).exec();

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
 *  /api/comment/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment
 *      summary: Remove comment by id.
 *      description: Also removes all replies to comment.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Comment/properties/id"
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Comment not found.
 *        '403':
 *          description: Must be creator of comment to delete comment.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove comment by id
router.delete("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN DELETE COMMENT TOO
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });

    if (documents.comment.creator !== documents.user.id) {
      throw new ResponseError(
        403,
        "Must be creator of comment to delete comment."
      );
    }

    // Remove the replies to comment, then comment
    await Comment.deleteMany({ replyTo: documents.comment.id }).exec();
    await Comment.deleteOne({ _id: documents.comment.id }).exec();

    // If replyTo comment has no more replies
    if (
      documents.comment.replyTo &&
      !(await Comment.exists({ replyTo: documents.comment.replyTo }))
    )
      await Comment.updateOne(
        { _id: documents.comment.replyTo },
        { hasReplies: false }
      ).exec();

    await updateCommunityEngagement(
      documents.user.username,
      documents.comment.community,
      -process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMENT || -1
    );

    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
