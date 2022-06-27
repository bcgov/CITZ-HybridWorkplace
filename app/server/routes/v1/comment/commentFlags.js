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
const getOptions = require("../../../functions/getOptions");

const router = express.Router();

const Comment = require("../../../models/comment.model");

/**
 * @swagger
 * paths:
 *  /api/comment/flags/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Flags
 *      summary: Get comment flags by comment id.
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
 *                $ref: '#/components/schemas/Comment/properties/flags'
 *        '400':
 *          description: Bad Request.
 */

// Get comment flags by comment id
router.get("/:id", async (req, res) => {
  try {
    req.log.addAction("Finding comment.");
    const documents = await findSingleDocuments({
      comment: req.params.id,
    });
    req.log.addAction("Comment found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(documents.comment.flags);
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
 *  /api/comment/flags/{id}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Flags
 *      summary: Flag comment by comment id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: '#/components/schemas/Comment/properties/id'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Comment/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Comment not found.
 *        '403':
 *          description: Invalid flag. Use one of <br>[Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Flag comment by comment id
router.post("/:id", async (req, res) => {
  try {
    req.log.addAction("Finding user and comment.");
    // TODO: Can documents be done with destructuring?
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });
    req.log.addAction("User and comment found.");

    req.log.addAction("Finding flags in options.");
    const { flags } = await getOptions("flags");
    req.log.addAction("Flags in options found.");

    req.log.addAction("Checking flag query is valid.");
    if (!flags.includes(req.query.flag))
      throw new ResponseError(
        403,
        "Invalid flag. Use one of [Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]"
      );

    // If flag isn't set on post
    req.log.addAction("Checking if flag is set on comment.");
    if (
      !(await Comment.exists({
        _id: documents.comment.id,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      req.log.addAction("Creating flag on comment.");
      await Comment.updateOne(
        { _id: documents.comment.id },
        {
          $push: {
            flags: { flag: req.query.flag, flaggedBy: [documents.user.id] },
          },
        }
      );
    } else {
      // Add user to flaggedBy
      req.log.addAction("Adding user to flaggedBy.");
      await Comment.updateOne(
        {
          _id: documents.comment.id,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [documents.user.id] } }
      );
    }

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
 *  /api/comment/flags/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Comment Flags
 *      summary: Unset flag on comment by comment id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: '#/components/schemas/Comment/properties/id'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Comment/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Comment not found. **||** <br>Flag not found in query.
 *        '403':
 *          description: User has not flagged comment with specified flag.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Unset flag on comment by comment id
router.delete("/:id", async (req, res) => {
  try {
    req.log.addAction("Finding user and comment.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      comment: req.params.id,
    });
    req.log.addAction("User and comment found.");

    req.log.addAction("Checking flag query.");
    if (!req.query.flag || req.query.flag === "")
      throw new ResponseError(404, "Flag not found in query.");

    // Check user has flagged comment
    req.log.addAction("Checking user has flagged comment with flag.");
    if (
      !(await Comment.exists({
        _id: documents.comment.id,
        "flags.flag": req.query.flag,
        "flags.flaggedBy": documents.user.id,
      }))
    )
      throw new ResponseError(
        403,
        `User has not flagged comment with ${req.query.flag}.`
      );
    req.log.addAction("User has flagged comment with flag.");

    // Remove user from flaggedBy
    req.log.addAction("Removing user from flaggedBy.");
    await Comment.updateOne(
      {
        _id: documents.comment.id,
        flags: { $elemMatch: { flag: req.query.flag } },
      },
      { $pull: { "flags.$.flaggedBy": documents.user.id } }
    );
    req.log.addAction("User removed from flaggedBy.");

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
