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
const Community = require("../../../models/community.model");

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
router.get("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      post: req.params.id,
    });

    return res.status(200).json(documents.post.tags);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
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
router.post("/:id", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });

    if (!req.query.tag) throw new ResponseError(404, "Tag not found in query.");

    // Check community has tag
    if (
      !(await Community.exists({
        title: documents.post.community,
        "tags.tag": req.query.tag,
      }))
    )
      throw new ResponseError(403, "Tag must be used by community.");

    // Check duplicate tag
    if (
      await Post.exists({
        _id: documents.post.id,
        "tags.taggedBy": documents.user.id,
      })
    )
      throw new ResponseError(403, "Limit 1 tag per post, per user.");

    // If tag isn't set on post
    if (
      !(await Post.exists({
        _id: documents.post.id,
        "tags.tag": req.query.tag,
      }))
    ) {
      // Create tag
      await Post.updateOne(
        { _id: documents.post.id },
        {
          $push: {
            tags: { tag: req.query.tag, taggedBy: [documents.user.id] },
          },
        }
      );
    } else {
      // Add user to taggedBy
      await Post.updateOne(
        {
          _id: documents.post.id,
          flags: { $elemMatch: { tag: req.query.tag } },
        },
        { $addToSet: { "tags.$.taggedBy": [documents.user.id] } }
      );
    }

    // Increment tag count in community
    await Community.updateOne(
      {
        title: documents.post.community,
        tags: { $elemMatch: { tag: req.query.tag } },
      },
      { $inc: { "tags.$.count": 1 } }
    );

    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
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
router.delete("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN EDIT POST TOO
    const documents = await findSingleDocuments({
      user: req.user.username,
      post: req.params.id,
    });

    // Check user has tagged post
    if (
      !(await Post.exists({
        _id: documents.post.id,
        "tags.taggedBy": documents.user.id,
      }))
    )
      throw new ResponseError(403, "User has not tagged post.");

    const selectedTag = await Post.findOne(
      { _id: documents.post.id },
      { tags: { $elemMatch: { taggedBy: documents.user.id } } }
    );

    // Remove user from taggedBy
    await Post.updateOne(
      {
        _id: documents.post.id,
        tags: { $elemMatch: { taggedBy: documents.user.id } },
      },
      { $pull: { "tags.$.taggedBy": documents.user.id } }
    );

    // Remove tag from post if taggedBy is length 1 (only user)
    if (selectedTag.tags[0].taggedBy.length === 1) {
      // Remove tag
      await Post.updateOne(
        {
          _id: documents.post.id,
          // eslint-disable-next-line no-underscore-dangle
          tags: { $elemMatch: { _id: selectedTag.tags[0]._id } },
        },
        // eslint-disable-next-line no-underscore-dangle
        { $pull: { tags: { _id: selectedTag.tags[0]._id } } }
      );
    }

    // Decrement tag count in community
    await Community.updateOne(
      {
        title: documents.post.community,
        tags: { $elemMatch: { tag: selectedTag.tags[0].tag } },
      },
      { $inc: { "tags.$.count": -1 } }
    );

    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
