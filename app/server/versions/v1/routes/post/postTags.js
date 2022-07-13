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
const checkUserIsMemberOfCommunity = require("../../functions/checkUserIsMemberOfCommunity");

const router = express.Router();

const Post = require("../../models/post.model");
const Community = require("../../models/community.model");

/**
 * @swagger
 * paths:
 *  /api/post/tags/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Tags
 *      summary: Get post tags by post id.
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
 *                $ref: '#/components/schemas/Post/properties/tags'
 *        '400':
 *          description: Bad Request.
 */

// Get post tags by post id
router.get("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding post.");
    const { post } = await findSingleDocuments({
      post: req.params.id,
    });
    req.log.addAction("Post found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(post.tags);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/tags/{id}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Tags
 *      summary: Tag post by id
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *        - in: query
 *          required: true
 *          name: tag
 *          schema:
 *            $ref: '#/components/schemas/Post/properties/tags/items/properties/tag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found. **||** <br>Tag not found in query.
 *        '403':
 *          description: Tag must be used by community. **||** <br>Limit 1 tag per user, per post.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Tag post by id
router.post("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });
    req.log.addAction("User and post found.");

    req.log.addAction("checking tag query.");
    if (!req.query.tag || req.query.tag === "")
      throw new ResponseError(404, "Tag not found in query.");

    req.log.addAction("Checking user is member of community.");
    await checkUserIsMemberOfCommunity(user.username, post.community);
    req.log.addAction("User is member of community.");

    // Check community has tag
    req.log.addAction("Checking community has tag.");
    if (
      !(await Community.exists({
        title: post.community,
        "tags.tag": req.query.tag,
      }))
    )
      throw new ResponseError(403, "Tag must be used by community.");
    req.log.addAction("Community has tag.");

    // Check duplicate tag
    req.log.addAction("Checking duplicate tag.");
    if (
      await Post.exists({
        _id: post.id,
        "tags.taggedBy": user.id,
      })
    )
      throw new ResponseError(403, "Limit 1 tag per post, per user.");

    // If tag isn't set on post
    req.log.addAction("Checking if tag isn't set on post.");
    if (
      !(await Post.exists({
        _id: post.id,
        "tags.tag": req.query.tag,
      }))
    ) {
      // Create tag
      req.log.addAction("Creating tag on post.");
      await Post.updateOne(
        { _id: post.id },
        {
          $push: {
            tags: { tag: req.query.tag, taggedBy: [user.id] },
          },
        }
      );
      req.log.addAction("Tag created on post.");
    } else {
      // Add user to taggedBy
      req.log.addAction("Adding user to taggedBy.");
      await Post.updateOne(
        {
          _id: post.id,
          tags: { $elemMatch: { tag: req.query.tag } },
        },
        { $addToSet: { "tags.$.taggedBy": user.id } }
      );
      req.log.addAction("User added to taggedBy.");
    }

    // Increment tag count in community
    req.log.addAction("Incrementing tag count in community.");
    await Community.updateOne(
      {
        title: post.community,
        tags: { $elemMatch: { tag: req.query.tag } },
      },
      { $inc: { "tags.$.count": 1 } }
    );
    req.log.addAction("Tag count incremented.");

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
 *  /api/post/tags/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post Tags
 *      summary: Untag post by id
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '403':
 *          description: User has not tagged post
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Untag post by id
router.delete("/:id", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and post.");
    const { user, post } = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });
    req.log.addAction("User and post found.");

    // Check user has tagged post
    req.log.addAction("Checking if user has tagged post.");
    if (
      !(await Post.exists({
        _id: post.id,
        "tags.taggedBy": user.id,
      }))
    )
      throw new ResponseError(403, "User has not tagged post.");
    req.log.addAction("User has tagged post.");

    // Get tag that user has tagged the post with
    req.log.addAction("Finding selected tag on post.");
    const selectedTag = await Post.findOne(
      { _id: post.id },
      { tags: { $elemMatch: { taggedBy: user.id } } }
    );
    req.log.addAction("Selected tag found.");

    // Remove user from taggedBy
    req.log.addAction("Removing user from taggedBy.");
    await Post.updateOne(
      {
        _id: post.id,
        tags: { $elemMatch: { taggedBy: user.id } },
      },
      { $pull: { "tags.$.taggedBy": user.id } }
    );
    req.log.addAction("User removed from taggedBy.");

    // Remove tag from post if taggedBy is length 1 (only user)
    req.log.addAction("Checking if taggedBy only includes user.");
    if (selectedTag.tags[0].taggedBy.length === 1) {
      // Remove tag
      req.log.addAction("Removing tag from post.");
      await Post.updateOne(
        {
          _id: post.id,
          // eslint-disable-next-line no-underscore-dangle
          tags: { $elemMatch: { _id: selectedTag.tags[0]._id } },
        },
        // eslint-disable-next-line no-underscore-dangle
        { $pull: { tags: { _id: selectedTag.tags[0]._id } } }
      );
    }

    // Decrement tag count in community
    req.log.addAction("Decrementing tag count in community.");
    await Community.updateOne(
      {
        title: post.community,
        tags: { $elemMatch: { tag: selectedTag.tags[0].tag } },
      },
      { $inc: { "tags.$.count": -1 } }
    );
    req.log.addAction("Tag count decremented.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
