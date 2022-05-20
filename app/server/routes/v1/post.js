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

// Create post
router.post("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    const post = await Post.create({
      title: req.body.title,
      message: req.body.message,
      creator: user.id,
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

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}, "", { sort: { _id: -1 } }).exec();

    if (!posts) return res.status(404).send("Post not found.");

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOneById({ _id: req.params.id }).exec();

    if (!post) return res.status(404).send("Post not found.");

    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Edit post by id
router.patch("/:id", async (req, res) => {
  try {
    // FIX ME: MODERATORS CAN EDIT POST TOO
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    const post = await Post.findOneById({ _id: req.params.id }).exec();

    if (!post) return res.sendStatus(404);
    if (post.creator !== user.id)
      return res
        .status(401)
        .send("Not Authorized. Only creator of post can edit post.");

    // Update post
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Remove post by id
router.delete("/:id", async (req, res) => {
  try {
    // FIX ME: MODERATORS CAN DELETE POST TOO
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    const post = await Post.findByIdAndDelete({ _id: req.params.id }).exec();

    if (!post) return res.sendStatus(404);

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

module.exports = router;
