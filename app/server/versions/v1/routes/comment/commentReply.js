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

const findSingleDocuments = require("../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../functions/checkUserIsMemberOfCommunity");
const updateCommunityEngagement = require("../../functions/updateCommunityEngagement");
const getOptions = require("../../functions/getOptions");
const getFullName = require("../../functions/getFullName");

const router = express.Router();

const Comment = require("../../models/comment.model");

/**
 * @swagger
 * paths:
 *  /api/comment/reply/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Replies
 *      summary: Get all replies to comment with id.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          type: string
 *      responses:
 *        '404':
 *          description: Comment not found.
 *        '200':
 *          description: Success.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 *        '400':
 *          description: Bad Request.
 */

// Get all replies to comment with id
router.get("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding comment.");
    const { comment } = await findSingleDocuments({
      comment: req.params.id,
    });
    req.log.addAction("Comment found.");

    req.log.addAction("Finding replies.");
    const replies = await Comment.aggregate([
      { $match: { replyTo: comment.id, removed: false } },
      {
        $lookup: {
          from: "user",
          let: { objIdCreator: { $toObjectId: "$creator" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$objIdCreator"] } } },
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
    req.log.addAction("Replies found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(replies);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/comment/reply/{id}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Replies
 *      summary: Reply to comment with id.
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          type: string
 *      requestBody:
 *        required: true
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
 *          description: Missing message in body of the request. **||** <br>User must be a part of community. **||** <br>Not allowed to reply to a reply.
 *        '201':
 *          description: Reply successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Comment'
 *        '400':
 *          description: Bad Request.
 */

// Reply to comment with id
router.post("/:id", async (req, res, next) => {
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

    req.log.addAction("Checking reply is not replying to a reply.");
    if (comment.replyTo)
      throw new ResponseError(403, "Not allowed to reply to a reply.");
    req.log.addAction("replyTo comment is not a reply.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(user.username, comment.community);
    req.log.addAction("User is member of community.");

    req.log.addAction("Checking message in req body.");
    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    req.log.addAction("Updating hasReplies on replyTo comment.");
    await Comment.updateOne({ _id: comment.id }, { hasReplies: true }).exec();
    req.log.addAction("hasReplies updated.");

    // Create reply
    req.log.addAction("Creating reply.");
    const reply = await Comment.create({
      message: req.body.message,
      creator: user.id,
      creatorName: getFullName(user) || user.username,
      creatorUsername: user.username,
      post: comment.post,
      community: comment.community,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      replyTo: comment.id,
    });
    req.log.addAction("Reply created.");

    req.log.addAction("Updating community engagement.");
    await updateCommunityEngagement(
      user.username,
      comment.community,
      process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMENT || 1
    );
    req.log.addAction("Community engagement updated.");

    req.log.setResponse(201, "Success");
    return res.status(201).json(reply);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
