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

const Post = require("../../../models/post.model");
const Comment = require("../../../models/comment.model");
const User = require("../../../models/user.model");
const Community = require("../../../models/community.model");

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
 *          description: Missing message in body of the request. **||** <br>Must be a part of community to post in community.
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
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.body.post });

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

    if (!user.communities.includes(post.community))
      return res
        .status(403)
        .send("Must be a part of community to comment in community.");

    if (!req.body.message || req.body.message === "")
      return res.status(403).send("Missing message in body of the request.");

    const comment = await Comment.create({
      message: req.body.message,
      creator: user.id,
      post: post.id,
    });

    return res.status(201).json(comment);
  } catch (err) {
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
 *      summary: Get all comments from post id.
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

// Get all comments from post id
router.get("/post/:id", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.params.post });

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

    const comments = await Comment.find({ post: post.id }, "", {
      sort: { _id: -1 },
    }).exec();

    if (!comments) return res.status(404).send("Comments not found.");

    return res.status(200).json(comments);
  } catch (err) {
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
    const comment = await Comment.findOne({ _id: req.params.id }).exec();

    if (!comment) return res.status(404).send("Comment not found.");

    return res.status(200).json(comment);
  } catch (err) {
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
 *          description: Missing message in body of the request. **||** <br>Only creator of comment can edit comment. **||** <br>Can't edit creator or post of a comment.
 *        '204':
 *          description: Comment successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit comment by id
router.patch("/:id", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const comment = await Comment.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!comment) return res.status(404).send("Comment not found.");

    if (comment.creator !== user.id)
      return res.status(403).send("Only creator of comment can edit comment.");

    if (!req.body.message || req.body.message === "")
      return res.status(403).send("Missing message in body of the request.");

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    // eslint-disable-next-line consistent-return
    Object.keys(req.body).forEach((key) => {
      if (key === "creator" || key === "post") {
        return res.status(403).send("Can't edit creator or post of a comment.");
      }

      if (comment[key] && comment[key] !== req.body[key]) {
        // if the field in req.body exists, update/set it
        query.$set[key] = req.body[key];
      } else if (!comment[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await Comment.updateOne({ _id: req.params.id }, query).exec();

    return res.sendStatus(204);
  } catch (err) {
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
 *          description: Comment removed.
 *        '400':
 *          description: Bad Request.
 */

// Remove comment by id
router.delete("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN DELETE COMMENT TOO
    const user = await User.findOne({ name: req.user.name });
    const comment = await Comment.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!comment) return res.status(404).send("Comment not found.");

    if (comment.creator !== user.id) {
      return res
        .status(403)
        .send("Must be creator of comment to delete comment.");
    }
    return res.status(204).send("Comment removed.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
