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

const Post = require("../../models/post.model");
const User = require("../../models/user.model");
const Community = require("../../models/community.model");

/**
 * @swagger
 * paths:
 *  /api/post:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Create post.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Post/properties/title'
 *                message:
 *                  $ref: '#/components/schemas/Post/properties/message'
 *                community:
 *                  $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: Community can't have more than 3 pinned posts.
 *        '201':
 *          description: Post successfully created.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Create post
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const community = await Community.findOne({ title: req.body.community });

    if (!user) return res.status(404).send("User not found.");
    if (!community) return res.status(404).send("Community not found.");

    if (
      req.body.pinned === true &&
      (await Post.count({ community: community.title, pinned: true })) >= 3
    )
      return res
        .status(403)
        .send("Community can't have more than 3 pinned posts.");

    const post = await Post.create({
      title: req.body.title,
      message: req.body.message,
      creator: user.id,
      community: req.body.community,
      pinned: req.body.pinned || false,
    });

    return res.status(201).json(post);
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The Post in the body of the Request is either missing or malformed. ${err}`
      );
  }
});

/**
 * @swagger
 * paths:
 *  /api/post:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get all posts from communities user is apart of.
 *      responses:
 *        '404':
 *          description: Posts not found.
 *        '200':
 *          description: Posts successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get all posts from communities user is apart of
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    // If post belongs to community listed in user.communities
    const posts = await Post.find(
      { community: { $in: user.communities } },
      "",
      { sort: { pinned: -1, _id: -1 } }
    ).exec();

    if (!posts) return res.status(404).send("Posts not found.");

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get post by id.
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
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!post) return res.status(404).send("Post not found.");

    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/community/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Get all posts from community title.
 *      description: Optional query param 'tag' only returns posts tagged with 'tag'.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/title"
 *        - in: query
 *          required: false
 *          name: tag
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/tags/items/properties/tag"
 *      responses:
 *        '404':
 *          description: Posts not found. **||** <br>Community not found.
 *        '200':
 *          description: Posts successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Get all posts from community title (Optional query param 'tag' only returns posts tagged with 'tag')
router.get("/community/:title", async (req, res) => {
  try {
    const community = await Community.findOne({ title: req.params.title });

    if (!community) return res.status(404).send("Community not found.");

    let posts;

    if (req.query.tag) {
      // Return community posts by tag set in query
      posts = await Post.find(
        { community: community.title, "tags.tag": req.query.tag },
        "",
        {
          sort: { pinned: -1, _id: -1 },
        }
      ).exec();
    } else {
      // Return all community posts
      posts = await Post.find({ community: community.title }, "", {
        sort: { pinned: -1, _id: -1 },
      }).exec();
    }

    if (!posts) return res.status(404).send("Posts not found.");

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/{id}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Edit post by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  $ref: '#/components/schemas/Post/properties/title'
 *                message:
 *                  $ref: '#/components/schemas/Post/properties/message'
 *                community:
 *                  $ref: '#/components/schemas/Community/properties/title'
 *                pinned:
 *                  $ref: '#/components/schemas/Post/properties/pinned'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found. **||** <br>Community not found.
 *        '401':
 *          description: Not Authorized. Only creator of post can edit post.
 *        '403':
 *          description: Community can't have more than 3 pinned posts. **||** <br>Can't edit tags. Use /api/post/{id}/tags instead. **||** <br>Can't edit creator of a post.
 *        '204':
 *          description: Post successfully edited.
 *        '400':
 *          description: Bad Request.
 */

// Edit post by id
router.patch("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN EDIT POST TOO
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

    if (post.creator !== user.id)
      return res
        .status(401)
        .send("Not Authorized. Only creator of post can edit post.");

    if (req.body.pinned === true && req.body.community) {
      // pinned and community set in patch

      const community = await Community.findOne({ title: req.body.community });
      if (!community) return res.status(404).send("Community not found.");

      if (
        (await Post.count({ community: req.body.community, pinned: true })) >= 3
      )
        return res
          .status(403)
          .send("Community can't have more than 3 pinned posts.");
    } else if (req.body.pinned === true && !req.body.community) {
      // pinned set in patch, but not community
      if ((await Post.count({ community: post.community, pinned: true })) >= 3)
        return res
          .status(403)
          .send("Community can't have more than 3 pinned posts.");
    }

    // eslint-disable-next-line prefer-const
    let query = { $set: {} };

    Object.keys(req.body).forEach((key) => {
      if (key === "creator") {
        return res.status(403).send("Can't edit creator of a post.");
      }
      if (key === "tags") {
        return res
          .status(403)
          .send("Can't edit tags. Use /api/post/{id}/tags instead.");
      }

      if (post[key] && post[key] !== req.body[key]) {
        // if the field in req.body exists, update/set it
        query.$set[key] = req.body[key];
      } else if (!post[key]) {
        query.$set[key] = req.body[key];
      }
    });

    await Post.updateOne({ _id: req.params.id }, query).exec();

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
 *      summary: Remove post by id.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: id
 *          schema:
 *            $ref: "#/components/schemas/Post/properties/id"
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Post not found.
 *        '401':
 *          description: Not Authorized. Must be creator of post to delete post.
 *        '200':
 *          description: Post successfully edited.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Post'
 *        '400':
 *          description: Bad Request.
 */

// Remove post by id
router.delete("/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN DELETE POST TOO
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

    if (post.creator !== user.id) {
      return res
        .status(401)
        .send("Not Authorized. Must be creator of post to delete post.");
    }
    return res.status(204).send("Post removed.");
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/tags/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
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
router.get("/tags/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!post) return res.status(404).send("Post not found.");

    return res.status(200).json(post.tags);
  } catch (err) {
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
 *        - Post
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
 *          description: Successfully created tag.
 *        '400':
 *          description: Bad Request.
 */

// Tag post by id
router.post("/tags/:id", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");
    if (!req.query.tag) return res.status(404).send("Tag not found in query.");

    // Check community has tag
    if (
      !(await Community.exists({
        title: post.community,
        "tags.tag": req.query.tag,
      }))
    )
      return res.status(403).send("Tag must be used by community.");

    // Check duplicate tag
    if (
      await Post.exists({
        _id: post.id,
        "tags.taggedBy": user.id,
      })
    )
      return res.status(403).send("Limit 1 tag per user, per post.");

    // If tag isn't set on post
    if (
      !(await Post.exists({
        _id: post.id,
        "tags.tag": req.query.tag,
      }))
    ) {
      // Create tag
      await Post.updateOne(
        { _id: post.id },
        { $push: { tags: { tag: req.query.tag } } }
      );
    }

    // Add user to taggedBy
    await Post.updateOne(
      { _id: post.id, tags: { $elemMatch: { tag: req.query.tag } } },
      { $addToSet: { "tags.$.taggedBy": [user.id] } }
    );

    // Increment tag count in community
    await Community.updateOne(
      { title: post.community, tags: { $elemMatch: { tag: req.query.tag } } },
      { $inc: { "tags.$.count": 1 } }
    );

    return res.sendStatus(204);
  } catch (err) {
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
 *        - Post
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
 *          description: Successfully untagged post.
 *        '400':
 *          description: Bad Request.
 */

// Untag post by id
router.delete("/tags/:id", async (req, res) => {
  try {
    // TODO: MODERATORS CAN EDIT POST TOO
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({ _id: req.params.id }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

    // Check user has tagged post
    if (
      !(await Post.exists({
        _id: post.id,
        "tags.taggedBy": user.id,
      }))
    )
      return res.status(403).send("User has not tagged post.");

    const selectedTag = await Post.findOne(
      { _id: post.id },
      { tags: { $elemMatch: { taggedBy: user.id } } }
    );

    // Remove user from taggedBy
    await Post.updateOne(
      { _id: post.id, tags: { $elemMatch: { taggedBy: user.id } } },
      { $pull: { "tags.$.taggedBy": user.id } }
    );

    // Remove tag from post if taggedBy is length 1 (only user)
    if (selectedTag.tags[0].taggedBy.length === 1) {
      // Remove tag
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
    await Community.updateOne(
      {
        title: post.community,
        tags: { $elemMatch: { tag: selectedTag.tags[0].tag } },
      },
      { $inc: { "tags.$.count": -1 } }
    );

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/post/flags/{id}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Post
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
router.get("/flags/:id", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
    }).exec();

    if (!post) return res.status(404).send("Post not found.");

    return res.status(200).json(post.flags);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
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
 *        - Post
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
 *          description: Successfully set flag.
 *        '400':
 *          description: Bad Request.
 */

// Flag post by post id
router.post("/flags/:id", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({
      _id: req.params.id,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");

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
      return res
        .status(403)
        .send(
          "Invalid flag. Use one of [Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]"
        );

    // If flag isn't set on post
    if (
      !(await Post.exists({
        _id: post.id,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      await Post.updateOne(
        { _id: post.id },
        { $push: { flags: { flag: req.query.flag, flaggedBy: [user.id] } } }
      );
    } else {
      // Add user to flaggedBy
      await Post.updateOne(
        {
          _id: post.id,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [user.id] } }
      );
    }

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
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
 *        - Post
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
 *          description: Successfully unset flag.
 *        '400':
 *          description: Bad Request.
 */

// Unset flag on post by post id
router.delete("/flags/:id", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });
    const post = await Post.findOne({
      _id: req.params.id,
    }).exec();

    if (!user) return res.status(404).send("User not found.");
    if (!post) return res.status(404).send("Post not found.");
    if (!req.query.flag)
      return res.status(404).send("Flag not found in query.");

    // Check user has flagged post
    if (
      !(await Post.exists({
        _id: post.id,
        "flags.flag": req.query.flag,
        "flags.flaggedBy": user.id,
      }))
    )
      return res
        .status(403)
        .send("User has not flagged post with specified flag.");

    // Remove user from flaggedBy
    await Post.updateOne(
      {
        _id: post.id,
        flags: { $elemMatch: { flag: req.query.flag } },
      },
      { $pull: { "flags.$.flaggedBy": user.id } }
    );

    return res.sendStatus(204);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
