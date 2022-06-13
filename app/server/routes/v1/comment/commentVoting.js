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
const ResponseError = require("../../../responseError");

const findSingleDocuments = require("../../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../../functions/checkUserIsMemberOfCommunity");

const router = express.Router();

const Comment = require("../../../models/comment.model");

/**
 * @swagger
 * paths:
 *  /api/comment/vote/{id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Voting
 *      summary: Upvote/downvote or unset vote comment.
 *      description: Use query parameter "vote" with values "up", "down", or "unset".
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/Comment/properties/id'
 *        - in: query
 *          name: vote
 *          required: true
 *          example: up
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Comment not found. **||** <br>Vote not found in query.
 *        '403':
 *          description: Missing message in body of the request. **||** <br>User must be a part of community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Upvote/downvote or unset vote comment
router.patch("/:id", async (req, res) => {
  try {
    req.log.addAction("Finding user and comment.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });
    req.log.addAction("User and comment found.");

    req.log.addAction("Checking vote query field exists.");
    if (!req.query.vote || req.query.vote === "")
      throw new ResponseError(404, "Vote not found in query.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(
      documents.user.username,
      documents.comment.community
    );
    req.log.addAction("User is member of community.");

    let query;

    req.log.addAction("Setting vote query.");
    if (documents.comment.upvotes.users.includes(documents.user.id)) {
      // User has already upvoted
      req.log.addAction("User has already upvoted.");
      switch (req.query.vote) {
        case "down":
          // Change to downvote
          req.log.addAction("Changing vote to downvote.");
          query = {
            $inc: { "upvotes.count": -1, "downvotes.count": 1 },
            $pull: { "upvotes.users": documents.user.id },
            $push: { "downvotes.users": documents.user.id },
          };
          break;
        default:
          // Unvote
          req.log.addAction("Setting query to unvote.");
          query = {
            $inc: { "upvotes.count": -1 },
            $pull: { "upvotes.users": documents.user.id },
          };
      }
    } else if (documents.comment.downvotes.users.includes(documents.user.id)) {
      // User has already downvoted
      req.log.addAction("User has already downvoted.");
      switch (req.query.vote) {
        case "up":
          // Change to upvote
          req.log.addAction("Changing vote to upvote.");
          query = {
            $inc: { "upvotes.count": 1, "downvotes.count": -1 },
            $pull: { "downvotes.users": documents.user.id },
            $push: { "upvotes.users": documents.user.id },
          };
          break;
        default:
          // Unvote
          req.log.addAction("Setting query to unvote.");
          query = {
            $inc: { "downvotes.count": -1 },
            $pull: { "downvotes.users": documents.user.id },
          };
      }
    } else {
      // User has not voted
      req.log.addAction("User has not voted.");
      switch (req.query.vote) {
        case "up":
          req.log.addAction("Setting query to upvote.");
          query = {
            $inc: { "upvotes.count": 1 },
            $push: { "upvotes.users": documents.user.id },
          };
          break;
        case "down":
          req.log.addAction("Setting query to downvote.");
          query = {
            $inc: { "downvotes.count": 1 },
            $push: { "downvotes.users": documents.user.id },
          };
          break;
        default:
          throw new ResponseError(
            404,
            "Vote not found or unrecognized query value."
          );
      }
    }

    req.log.addAction("Updating comment with vote query.");
    if (query)
      await Comment.updateOne({ _id: documents.comment.id }, query).exec();
    req.log.addAction("Comment updated.");

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
