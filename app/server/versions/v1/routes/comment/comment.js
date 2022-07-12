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
const ResponseError = require("../../classes/responseError");

const checkPatchQuery = require("../../functions/checkPatchQuery");
const findSingleDocuments = require("../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../functions/checkUserIsMemberOfCommunity");
const updateCommunityEngagement = require("../../functions/updateCommunityEngagement");
const getOptions = require("../../functions/getOptions");
const getFullName = require("../../functions/getFullName");
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

const router = express.Router();

const Comment = require("../../models/comment.model");
const Post = require("../../models/post.model");
const Community = require("../../models/community.model");

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
router.post("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments({
      user: req.user.username,
      post: req.body.post,
    });
    req.log.addAction("User and post found.");

    req.log.addAction("Finding options.");
    const {
      messageMinLength,
      messageMaxLength,
      createCommentEngagementWeight,
    } = await getOptions("comment");
    req.log.addAction("Options found.");

    req.log.addAction("Trimming leading and trailing spaces.");
    req.body.message = req.body.message.trim();
    req.log.addAction(`Comment trimmed: ${req.body.message}.`);

    // Validate comment length
    const messageLengthError = `message does not meet requirements: length ${messageMinLength}-${messageMaxLength}.`;
    req.log.addAction("Validating message.");
    if (
      req.body.message.length < messageMinLength ||
      req.body.message.length > messageMaxLength
    )
      throw new ResponseError(403, messageLengthError);
    req.log.addAction("message is valid.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(user.username, post.community);
    req.log.addAction("User is member of community.");

    req.log.addAction("Checking message in req body.");
    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    req.log.addAction("Creating comment.");
    const comment = await Comment.create({
      message: req.body.message,
      creator: user.id,
      creatorName: getFullName(user) || user.username,
      post: post.id,
      community: post.community,
      "upvotes.count": 0,
      "downvotes.count": 0,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
    });
    req.log.addAction("Comment created.");

    const returnComment = await Comment.aggregate([
      { $match: { _id: new ObjectId(comment.id) } },
      {
        $lookup: {
          from: "user",
          pipeline: [
            {
              $match: { _id: new ObjectId(comment.creator) },
            },
          ],
          as: "userData",
        },
      },
      {
        $addFields: {
          votes: {
            $ifNull: [{ $subtract: ["$upvotes.count", "$downvotes.count"] }, 0],
          },
          avatar: { $arrayElemAt: ["$userData.avatar", 0] },
          creatorInitials: {
            $cond: {
              if: { $arrayElemAt: ["$userData.lastName", 0] },
              then: {
                $concat: [
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.firstName", 0] },
                      0,
                      1,
                    ],
                  },
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.lastName", 0] },
                      0,
                      1,
                    ],
                  },
                ],
              },
              else: {
                $substr: [{ $arrayElemAt: ["$userData.firstName", 0] }, 0, 1],
              },
            },
          },
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
      { $sort: { votes: -1, _id: 1 } },
    ]).exec();

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
      post.community,
      createCommentEngagementWeight || 1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction("Updating community latest activity.");
    await Community.updateOne(
      { title: comment.community },
      { $set: { latestActivity: moment().format("MMMM Do YYYY, h:mm:ss a") } }
    );
    req.log.addAction("Community latest activity updated.");

    req.log.addAction("Updating post's comment count.");
    await Post.updateOne({ _id: post.id }, { $inc: { commentCount: 1 } });
    req.log.addAction("Post's comment count updated.");

    req.log.setResponse(201, "Success", null);
    return res.status(201).json(returnComment[0]);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.get("/post/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });
    req.log.addAction("User and post found.");

    req.log.addAction(
      `Checking if user is moderator of community (${post.community}).`
    );
    const isModerator = await communityAuthorization.isCommunityModerator(
      user.username,
      post.community
    );

    const matchQuery = isModerator
      ? {
          post: post.id,
          replyTo: null,
        }
      : {
          post: post.id,
          replyTo: null,
          $or: [{ hidden: false }, { hidden: null }],
        };

    req.log.addAction("Finding comments on post.");
    const comments = await Comment.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "user",
          pipeline: [
            {
              $match: { _id: new ObjectId(post.creator) },
            },
          ],
          as: "userData",
        },
      },
      {
        $addFields: {
          votes: {
            $ifNull: [{ $subtract: ["$upvotes.count", "$downvotes.count"] }, 0],
          },
          avatar: { $arrayElemAt: ["$userData.avatar", 0] },
          creatorInitials: {
            $cond: {
              if: { $arrayElemAt: ["$userData.lastName", 0] },
              then: {
                $concat: [
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.firstName", 0] },
                      0,
                      1,
                    ],
                  },
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.lastName", 0] },
                      0,
                      1,
                    ],
                  },
                ],
              },
              else: {
                $substr: [{ $arrayElemAt: ["$userData.firstName", 0] }, 0, 1],
              },
            },
          },
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
      { $sort: { votes: -1, _id: 1 } },
    ]).exec();

    if (!comments) throw new ResponseError(404, "Comments not found.");
    req.log.addAction("Comments found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(comments);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.get("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding comment.");
    const { comment } = await findSingleDocuments({
      comment: req.params.id,
    });
    req.log.addAction("Comment found.");

    const returnComment = await Comment.aggregate([
      { $match: { _id: new ObjectId(comment.id) } },
      {
        $lookup: {
          from: "user",
          pipeline: [
            {
              $match: { _id: new ObjectId(comment.creator) },
            },
          ],
          as: "userData",
        },
      },
      {
        $addFields: {
          votes: {
            $ifNull: [{ $subtract: ["$upvotes.count", "$downvotes.count"] }, 0],
          },
          avatar: { $arrayElemAt: ["$userData.avatar", 0] },
          creatorInitials: {
            $cond: {
              if: { $arrayElemAt: ["$userData.lastName", 0] },
              then: {
                $concat: [
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.firstName", 0] },
                      0,
                      1,
                    ],
                  },
                  {
                    $substr: [
                      { $arrayElemAt: ["$userData.lastName", 0] },
                      0,
                      1,
                    ],
                  },
                ],
              },
              else: {
                $substr: [{ $arrayElemAt: ["$userData.firstName", 0] }, 0, 1],
              },
            },
          },
        },
      },
      {
        $project: {
          userData: 0,
        },
      },
      { $sort: { votes: -1, _id: 1 } },
    ]).exec();

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(returnComment);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
 *          description: Missing message in body of the request. **||** <br>Only creator of comment can edit comment. **||** <br>Can only edit the message of a comment. **||** <br>message does not meet requirements.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Edit comment by id
router.patch("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and comment.");
    const { user, comment } = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });
    req.log.addAction("User and comment found.");

    req.log.addAction("Finding options.");
    const { messageMinLength, messageMaxLength } = await getOptions("comment");
    req.log.addAction("Options found.");

    req.log.addAction("Trimming leading and trailing spaces.");
    req.body.message = req.body.message.trim();
    req.log.addAction(`Comment trimmed: ${req.body.message}.`);

    // Validate comment length
    const messageLengthError = `message does not meet requirements: length ${messageMinLength}-${messageMaxLength}.`;
    req.log.addAction("Validating message.");
    if (
      req.body.message.length < messageMinLength ||
      req.body.message.length > messageMaxLength
    )
      throw new ResponseError(403, messageLengthError);
    req.log.addAction("message is valid.");

    req.log.addAction("Checking user is creator of comment.");
    if (comment.creator !== user.id)
      throw new ResponseError(403, "Only creator of comment can edit comment.");
    req.log.addAction("Checking message in req body.");
    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    req.log.addAction(
      `Checking if user is moderator of community (${comment.community}).`
    );
    const isModerator = await communityAuthorization.isCommunityModerator(
      user.username,
      comment.community
    );

    const disallowedFields = isModerator
      ? [
          "creator",
          "creatorName",
          "post",
          "community",
          "createdOn",
          "replyTo",
          "hasReplies",
          "edits",
          "upvotes",
          "downvotes",
        ]
      : [
          "creator",
          "creatorName",
          "post",
          "hidden",
          "community",
          "createdOn",
          "replyTo",
          "hasReplies",
          "edits",
          "upvotes",
          "downvotes",
        ];

    req.log.addAction("Checking edit query.");
    const query = checkPatchQuery(req.body, comment, disallowedFields);
    req.log.addAction("Edit query has been cleaned.");

    // Edit history
    req.log.addAction("Updating edit history.");
    await Comment.updateOne(
      { _id: req.params.id },
      {
        $push: {
          edits: {
            precursor: comment.message,
            timeStamp: moment().format("MMMM Do YYYY, h:mm:ss a"),
          },
        },
      }
    ).exec();
    req.log.addAction("Edit history updated.");

    req.log.addAction("Updating comment with query.");
    await Comment.updateOne({ _id: req.params.id }, query).exec();
    req.log.addAction("Comment edited.");

    req.log.setResponse(204, "Success", null);
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
router.delete("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and comment.");
    const { user, comment } = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });
    req.log.addAction("User and comment found.");

    req.log.addAction("Finding options.");
    const { createCommentEngagementWeight } = await getOptions("comment");
    req.log.addAction("Options found.");

    req.log.addAction("Checking user is creator of comment.");
    if (comment.creator !== user.id)
      throw new ResponseError(
        403,
        "Must be creator of comment to delete comment."
      );
    req.log.addAction("User is creator of comment.");

    // Remove the replies to comment, then comment
    req.log.addAction("Removing replies to comment.");
    await Comment.deleteMany({ replyTo: comment.id }).exec();
    req.log.addAction("Replies removed. Removing comment.");
    await Comment.deleteOne({ _id: comment.id }).exec();
    req.log.addAction("Comment removed.");

    // If replyTo comment has no more replies
    req.log.addAction("Checking if replyTo comment has no more replies.");
    if (
      comment.replyTo &&
      !(await Comment.exists({ replyTo: comment.replyTo }))
    ) {
      req.log.addAction("Setting hasReplies on replyTo comment to false.");
      await Comment.updateOne(
        { _id: comment.replyTo },
        { hasReplies: false }
      ).exec();
      req.log.addAction("hasReplies set to false.");
    }

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
      comment.community,
      -createCommentEngagementWeight || -1
    );
    req.log.addAction("Community engagement updated.");

    req.log.addAction("Updating post's comment count.");
    await Post.updateOne({ _id: comment.post }, { $inc: { commentCount: -1 } });
    req.log.addAction("Post's comment count updated.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
