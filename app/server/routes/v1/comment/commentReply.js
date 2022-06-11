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

const findSingleDocuments = require("../../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../../functions/checkUserIsMemberOfCommunity");
const updateCommunityEngagement = require("../../../functions/updateCommunityEngagement");

const router = express.Router();

const Comment = require("../../../models/comment.model");

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
router.get("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      comment: req.params.id,
    });

    const replies = await Comment.aggregate([
      { $match: { replyTo: documents.comment.id } },
      {
        $addFields: {
          votes: {
            $ifNull: [{ $subtract: ["$upvotes.count", "$downvotes.count"] }, 0],
          },
        },
      },
      { $sort: { votes: -1, _id: 1 } },
    ]).exec();

    return res.status(200).json(replies);
  } catch (err) {
    // Excplicitly thrown error
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
router.post("/:id", async (req, res) => {
  req.log.setRequestBody(req.body, false);
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });

    if (documents.comment.replyTo)
      throw new ResponseError(403, "Not allowed to reply to a reply.");

    await checkUserIsMemberOfCommunity(
      documents.user.username,
      documents.comment.community
    );

    if (!req.body.message || req.body.message === "")
      throw new ResponseError(403, "Missing message in body of the request.");

    await Comment.updateOne(
      { _id: documents.comment.id },
      { hasReplies: true }
    ).exec();

    // Create reply
    const reply = await Comment.create({
      message: req.body.message,
      creator: documents.user.id,
      post: documents.comment.post,
      community: documents.comment.community,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      replyTo: documents.comment.id,
    });

    await updateCommunityEngagement(
      documents.user.username,
      documents.comment.community,
      process.env.COMMUNITY_ENGAGEMENT_WEIGHT_CREATE_COMMENT || 1
    );

    return res.status(201).json(reply);
  } catch (err) {
    // Excplicitly thrown error
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
