/* eslint-disable prefer-destructuring */
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
const ResponseError = require("../classes/responseError");

const router = express.Router();

const User = require("../models/user.model");
const Community = require("../models/community.model");
const Post = require("../models/post.model");

/**
 * @swagger
 * paths:
 *  /api/search/{query}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Search
 *      summary: Search by keyword.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: query
 *          schema:
 *            type: string
 *      responses:
 *        '200':
 *          description: Success.
 *        '400':
 *          description: Bad Request.
 */

// Search
router.get("/:query", async (req, res, next) => {
  try {
    let { query } = req.params;
    let sortCommunities;
    let filterAuthor;

    // Return posts by creator
    if (query.startsWith("creator:") || query.startsWith("author:")) {
      filterAuthor = query.split(":")[1];
      filterAuthor = filterAuthor.split(" ")[0];
      query = query.split(" ")[1];
    }

    // Return communities ordered by latestActivity
    if (query.startsWith("latestActivity:")) {
      sortCommunities = { latestActivity: -1 };
      query = query.split(" ")[1];
    }

    // Users
    const users = await User.aggregate([
      {
        $addFields: { fullName: { $concat: ["$firstName", " ", "$lastName"] } },
      },
      {
        $match: {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { firstName: { $regex: query, $options: "i" } },
            { lastName: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          fullName: 1,
          avatar: 1,
        },
      },
    ]);

    // Communities
    const communities = await Community.aggregate([
      {
        $match: {
          $and: [
            { removed: false },
            { title: { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          createdOn: 1,
          latestActivity: 1,
          memberCount: 1,
        },
      },
      { $sort: sortCommunities || { _id: -1 } },
    ]);

    // Posts
    const postFilter = filterAuthor
      ? { creatorUsername: { $regex: filterAuthor, $options: "i" } }
      : {};
    const posts = await Post.aggregate([
      {
        $match: {
          $and: [
            postFilter,
            { removed: false },
            { hidden: false },
            {
              $or: [
                { title: { $regex: query, $options: "i" } },
                { message: { $regex: query, $options: "i" } },
              ],
            },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          message: 1,
          community: 1,
          creatorName: 1,
          creatorUsername: 1,
          createdOn: 1,
          commentCount: 1,
          availableTags: 1,
          tags: 1,
          community: 1,
        },
      },
      { $sort: { _id: -1 } },
    ]);

    let results = filterAuthor ? { posts } : { users, communities, posts };
    if (sortCommunities) results = { communities };

    req.log.setResponse(200, "Success");
    res.status(200).json(results);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
