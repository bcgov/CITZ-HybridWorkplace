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
const ResponseError = require("../../classes/responseError");

const findSingleDocuments = require("../../functions/findSingleDocuments");
const getOptions = require("../../functions/getOptions");
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

const router = express.Router();

const Post = require("../../models/post.model");

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
router.get("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding post.");
    const { post } = await findSingleDocuments(
      {
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("Post found.");

    req.log.setResponse(200, "Success");
    return res.status(200).json(post.flags);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
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
router.post("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments(
      {
        user: req.user.username,
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and post found.");

    req.log.addAction("Finding flags in options.");
    const { flags } = await getOptions("flags");
    req.log.addAction("Flags in options found.");

    req.log.addAction("Checking flag query is valid.");
    if (!flags.includes(req.query.flag))
      throw new ResponseError(403, `Invalid flag. Use one of ${flags}`);

    // If flag isn't set on post
    req.log.addAction("Checking if flag is set on post.");
    if (
      !(await Post.exists({
        _id: post.id,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      req.log.addAction("Creating flag on post.");
      await Post.updateOne(
        { _id: post.id },
        {
          $push: {
            flags: { flag: req.query.flag, flaggedBy: [user.username] },
          },
        }
      );
    } else {
      // Add user to flaggedBy
      req.log.addAction("Adding user to flaggedBy.");
      await Post.updateOne(
        {
          _id: post.id,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [user.username] } }
      );
    }

    req.log.setResponse(204, "Success");
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
router.delete("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments(
      {
        user: req.user.username,
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and post found.");

    req.log.addAction("Checking flag query.");
    if (!req.query.flag || req.query.flag === "")
      throw new ResponseError(404, "Flag not found in query.");

    // Check user has flagged post
    req.log.addAction("Checking user has flagged post with flag.");
    if (
      !(await Post.exists({
        _id: post.id,
        "flags.flag": req.query.flag,
        "flags.flaggedBy": user.username,
      }))
    )
      throw new ResponseError(
        403,
        `User has not flagged post with ${req.query.flag}.`
      );
    req.log.addAction("User has flagged post with flag.");

    // Remove user from flaggedBy
    req.log.addAction("Removing user from flaggedBy.");
    await Post.updateOne(
      {
        _id: post.id,
        flags: { $elemMatch: { flag: req.query.flag } },
      },
      { $pull: { "flags.$.flaggedBy": user.username } }
    );
    req.log.addAction("User removed from flaggedBy.");

    req.log.setResponse(204, "Success");
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
 *  /api/post/flags/resolve/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Flags
 *      summary: Resolve all flags on post by post id.
 *      description: Optional query 'show=true' will show the post if it's hidden.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/id'
 *        - in: query
 *          required: false
 *          name: show
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: Not allowed to resolve flags unless you are a moderator of community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Resolve all flags on post by post id
router.delete("/resolve/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments(
      {
        user: req.user.username,
        post: req.params.id,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and post found.");

    req.log.addAction(
      `Checking if user is moderator of community (${post.community}).`
    );
    const isModerator = await communityAuthorization.isCommunityModerator(
      user.username,
      post.community
    );

    if (!isModerator)
      throw new ResponseError(
        403,
        `Not allowed to resolve flags unless you are a moderator of ${post.community} community.`
      );

    if (req.query.show === "true") {
      req.log.addAction("Resolving flags and setting hidden to false.");
      await Post.updateOne({ _id: post.id }, { flags: [], hidden: false });
      req.log.addAction("Flags resolved.");
    } else {
      req.log.addAction("Resolving flags.");
      await Post.updateOne({ _id: post.id }, { flags: [] });
      req.log.addAction("Flags resolved.");
    }

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
