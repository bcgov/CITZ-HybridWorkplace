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

const router = express.Router();

const Comment = require("../../../models/comment.model");
const User = require("../../../models/user.model");

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
 *          description: Missing message in body of the request. **||** <br>Must be a part of community to post in community.
 *        '204':
 *          description: Success.
 *        '400':
 *          description: Bad Request.
 */

// Upvote/downvote or unset vote comment
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    const comment = await Comment.findOne({ _id: req.params.id });

    if (!user) return res.status(404).send("User not found.");
    if (!comment) return res.status(404).send("Comment not found.");
    if (!req.query.vote)
      return res.status(404).send("Vote not found in query.");

    if (!user.communities.includes(comment.community))
      return res.status(403).send("Must be a part of community to vote.");

    let query;

    if (comment.upvotes.users.includes(user.id)) {
      // User has already upvoted
      switch (req.query.vote) {
        case "down":
          // Change to downvote
          query = {
            $inc: { "upvotes.count": -1, "downvotes.count": 1 },
            $pull: { "upvotes.users": user.id },
            $push: { "downvotes.users": user.id },
          };
          break;
        default:
          // Unvote
          query = {
            $inc: { "upvotes.count": -1 },
            $pull: { "upvotes.users": user.id },
          };
      }
    } else if (comment.downvotes.users.includes(user.id)) {
      // User has already downvoted
      switch (req.query.vote) {
        case "up":
          // Change to upvote
          query = {
            $inc: { "upvotes.count": 1, "downvotes.count": -1 },
            $pull: { "downvotes.users": user.id },
            $push: { "upvotes.users": user.id },
          };
          break;
        default:
          // Unvote
          query = {
            $inc: { "downvotes.count": -1 },
            $pull: { "downvotes.users": user.id },
          };
      }
    } else {
      // User has not voted
      switch (req.query.vote) {
        case "up":
          query = {
            $inc: { "upvotes.count": 1 },
            $push: { "upvotes.users": user.id },
          };
          break;
        case "down":
          query = {
            $inc: { "downvotes.count": 1 },
            $push: { "downvotes.users": user.id },
          };
          break;
      }
    }

    if (query) await Comment.updateOne({ _id: comment.id }, query).exec();

    return res.status(204).send("");
  } catch (err) {
    console.log(err);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
