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

const router = express.Router();

const Post = require("../../../models/post.model");

/**
 * @swagger
 * paths:
 *  /api/post/flags/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Flags
 *      summary: Get post flags by post id.
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
 *                $ref: '#/components/schemas/Post/properties/flags'
 *        '400':
 *          description: Bad Request.
 */

// Get post flags by post id
router.get("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      post: req.params.id,
    });

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(documents.post.flags);
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
 *  /api/post/flags/{id}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Flags
 *      summary: Flag post by post id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/id'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: Invalid flag. Use one of <br>[Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Flag post by post id
router.post("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });

    // TODO: Set flags in an options collection, that can be edited by admins
    const flags = [
      "Inappropriate",
      "Hate",
      "Harassment or Bullying",
      "Spam",
      "Misinformation",
      "Against Community Rules",
    ];

    if (!flags.includes(req.query.flag))
      throw new ResponseError(
        403,
        "Invalid flag. Use one of [Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]"
      );

    // If flag isn't set on post
    if (
      !(await Post.exists({
        _id: documents.post.id,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      await Post.updateOne(
        { _id: documents.post.id },
        {
          $push: {
            flags: { flag: req.query.flag, flaggedBy: [documents.user.id] },
          },
        }
      );
    } else {
      // Add user to flaggedBy
      await Post.updateOne(
        {
          _id: documents.post.id,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [documents.user.id] } }
      );
    }

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
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
 *  /api/post/flags/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Flags
 *      summary: Unset flag on post by post id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/id'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found. **||** <br>Flag not found in query.
 *        '403':
 *          description: User has not flagged post with specified flag.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Unset flag on post by post id
router.delete("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });

    if (!req.query.flag)
      throw new ResponseError(404, "Flag not found in query.");

    // Check user has flagged post
    if (
      !(await Post.exists({
        _id: documents.post.id,
        "flags.flag": req.query.flag,
        "flags.flaggedBy": documents.user.id,
      }))
    )
      throw new ResponseError(
        403,
        `User has not flagged post with ${req.query.flag}.`
      );

    // Remove user from flaggedBy
    await Post.updateOne(
      {
        _id: documents.post.id,
        flags: { $elemMatch: { flag: req.query.flag } },
      },
      { $pull: { "flags.$.flaggedBy": documents.user.id } }
    );

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
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
