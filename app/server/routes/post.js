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

const Post = require('../models/post.model');
const authenticateToken = require('../middleware/authenticateToken');

// Create post
router.post('/', authenticateToken, async (req, res) => {
    try {
        const post = await Post.create({
            title: req.body.title,
            message: req.body.message,
            creator: req.user.name,
        });
       
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400)
        .send('Bad Request. The Post in the body of the Request is either missing or malformed. ' + err);
    }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find({}, "", { sort: { _id: -1 } }).exec();

    if (!posts) return res.sendStatus(404);

    return res.status(200).json(posts);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Get post by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOneById({ _id: req.params.id }).exec();

    if (!post) return res.sendStatus(404);

    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Edit post by id
// FIX ME: AUTH
router.patch("/:id", async (req, res) => {
  try {
    // FIX ME: AUTH USER IS OWNER OF POST OR MODERATOR
    const post = await Post.findOneById({ _id: req.params.id }).exec();

    if (!post) return res.sendStatus(404);

    // Update post
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

// Remove post by id
// FIX ME: AUTH
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete({ _id: req.params.id }).exec();

    if (!post) {
      return res.sendStatus(404);
    }

    // FIX ME: AUTH ONLY CREATOR OF POST OR MODERATOR
    if (post.creator.name === req.user.name) {
      return res.status(200).send("Post removed.");
    }
    // Not authorized
    return res.sendStatus(401);
  } catch (err) {
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
