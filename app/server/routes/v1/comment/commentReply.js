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

const router = express.Router();

const Comment = require("../../../models/comment.model");
const User = require("../../../models/user.model");

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
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) return res.status(404).send("Comment not found.");

    const replies = await Comment.aggregate([
      { $match: { replyTo: comment.id } },
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
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
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
 *          description: Missing message in body of the request. **||** <br>Must be a part of community to post in community. **||** <br>Not allowed to reply to a reply.
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
  try {
    const user = await User.findOne({ name: req.user.name });
    const comment = await Comment.findOne({ _id: req.params.id });

    if (!user) return res.status(404).send("User not found.");
    if (!comment) return res.status(404).send("Comment not found.");

    if (comment.replyTo)
      return res.status(403).send("Not allowed to reply to a reply.");

    if (
      !(await User.exists({
        _id: user.id,
        "communities.community": comment.community,
      }))
    )
      return res
        .status(403)
        .send("Must be a part of community to comment in community.");

    if (!req.body.message || req.body.message === "")
      return res.status(403).send("Missing message in body of the request.");

    await Comment.updateOne({ _id: comment.id }, { hasReplies: true }).exec();

    // Create reply
    const reply = await Comment.create({
      message: req.body.message,
      creator: user.id,
      post: comment.post,
      community: comment.community,
      createdOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
      replyTo: comment.id,
    });

    return res.status(201).json(reply);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
