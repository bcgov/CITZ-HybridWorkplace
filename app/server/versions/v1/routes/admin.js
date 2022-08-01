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

const findSingleDocuments = require("../functions/findSingleDocuments");

const router = express.Router();

const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/admin:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Admin
 *      summary: Get all data for admin dashboard.
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Returned admin dashboard data.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *        '400':
 *          description: Bad Request.
 */

// Get all data for admin dashboard.
router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    req.log.addAction("Checking user is admin.");
    if (user.role !== "admin") throw new ResponseError(403, "Must be admin.");
    req.log.addAction("User is admin.");

    req.log.addAction("Finding posts.");
    const postRows = await Post.aggregate([
      {
        $project: {
          _id: 1,
          flagCount: { $ifNull: ["$flagCount", 0] },
          title: { $ifNull: ["$title", ""] },
          message: { $ifNull: ["$message", ""] },
          creatorUsername: { $ifNull: ["$creatorUsername", ""] },
          community: { $ifNull: ["$community", ""] },
          createdOn: { $ifNull: ["$createdOn", ""] },
          commentCount: { $ifNull: ["$commentCount", 0] },
          pinned: { $ifNull: ["$pinned", false] },
          removed: { $ifNull: ["$removed", false] },
          hidden: { $ifNull: ["$hidden", false] },
        },
      },
    ]);

    const postColumns = [
      {
        field: "_id",
        headerName: "Post ID",
        width: 50,
      },
      {
        field: "flagCount",
        headerName: "Flags",
        width: 30,
      },
      {
        field: "title",
        headerName: "Title",
        width: 100,
      },
      {
        field: "message",
        headerName: "Message",
        width: 100,
      },
      {
        field: "creatorUsername",
        headerName: "Creator Username",
        width: 100,
      },
      {
        field: "community",
        headerName: "Community",
        width: 100,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        width: 100,
      },
      {
        field: "commentCount",
        headerName: "Comment Count",
        width: 30,
      },
      {
        field: "pinned",
        headerName: "Pinned",
        width: 30,
      },
      {
        field: "removed",
        headerName: "Removed",
        width: 30,
      },
      {
        field: "hidden",
        headerName: "Hidden",
        width: 30,
      },
    ];

    req.log.addAction("Finding communities.");
    const communityRows = await Community.aggregate([
      {
        $project: {
          _id: 1,
          flagCount: { $ifNull: ["$flagCount", 0] },
          title: { $ifNull: ["$title", ""] },
          description: { $ifNull: ["$description", ""] },
          creatorUsername: { $ifNull: ["$creatorUsername", ""] },
          createdOn: { $ifNull: ["$createdOn", ""] },
          latestActivity: { $ifNull: ["$latestActivity", ""] },
          removed: { $ifNull: ["$removed", false] },
          memberCount: { $ifNull: ["$memberCount", 0] },
          postCount: { $ifNull: ["$postCount", 0] },
        },
      },
    ]);

    const communityColumns = [
      {
        field: "_id",
        headerName: "ID",
        width: 50,
      },
      {
        field: "flagCount",
        headerName: "Flags",
        width: 30,
      },
      {
        field: "title",
        headerName: "Title",
        width: 100,
      },
      {
        field: "description",
        headerName: "Description",
        width: 100,
      },
      {
        field: "creatorUsername",
        headerName: "Creator Username",
        width: 100,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        width: 100,
      },
      {
        field: "latestActivity",
        headerName: "Latest Activity",
        width: 100,
      },
      {
        field: "removed",
        headerName: "Removed",
        width: 30,
      },
      {
        field: "memberCount",
        headerName: "Member Count",
        width: 30,
      },
      {
        field: "postCount",
        headerName: "Post Count",
        width: 30,
      },
    ];

    req.log.addAction("Finding comments.");
    const commentRows = await Comment.aggregate([
      {
        $project: {
          _id: 1,
          flagCount: { $ifNull: ["$flagCount", 0] },
          post: { $ifNull: ["$post", ""] },
          message: { $ifNull: ["$message", ""] },
          creatorUsername: { $ifNull: ["$creatorUsername", ""] },
          community: { $ifNull: ["$community", ""] },
          createdOn: { $ifNull: ["$createdOn", ""] },
          replyTo: { $ifNull: ["$replyTo", ""] },
          hasReplies: { $ifNull: ["$hasReplies", false] },
          removed: { $ifNull: ["$removed", false] },
          hidden: { $ifNull: ["$hidden", false] },
        },
      },
    ]);

    const commentColumns = [
      {
        field: "_id",
        headerName: "Comment ID",
        width: 50,
      },
      {
        field: "flagCount",
        headerName: "Flags",
        width: 30,
      },
      {
        field: "post",
        headerName: "Post ID",
        width: 50,
      },
      {
        field: "message",
        headerName: "Message",
        width: 100,
      },
      {
        field: "creatorUsername",
        headerName: "Creator Username",
        width: 100,
      },
      {
        field: "community",
        headerName: "Community",
        width: 100,
      },
      {
        field: "createdOn",
        headerName: "Created On",
        width: 100,
      },
      {
        field: "replyTo",
        headerName: "Reply To",
        width: 50,
      },
      {
        field: "hasReplies",
        headerName: "Has Replies",
        width: 30,
      },
      {
        field: "removed",
        headerName: "Removed",
        width: 30,
      },
      {
        field: "hidden",
        headerName: "Hidden",
        width: 30,
      },
    ];

    req.log.addAction("Finding users.");
    const userRows = await User.aggregate([
      {
        $project: {
          _id: 1,
          username: { $ifNull: ["$username", ""] },
          firstName: { $ifNull: ["$firstName", ""] },
          lastName: { $ifNull: ["$lastName", ""] },
          email: { $ifNull: ["$email", ""] },
          registeredOn: { $ifNull: ["$registeredOn", ""] },
        },
      },
    ]);

    const userColumns = [
      {
        field: "_id",
        headerName: "User ID",
        width: 50,
      },
      {
        field: "username",
        headerName: "Username",
        width: 100,
      },
      {
        field: "firstName",
        headerName: "First Name",
        width: 100,
      },
      {
        field: "lastName",
        headerName: "Last Name",
        width: 100,
      },
      {
        field: "email",
        headerName: "Email",
        width: 100,
      },
      {
        field: "registeredOn",
        headerName: "Registered On",
        width: 100,
      },
    ];

    req.log.setResponse(200, "Success");
    return res.status(200).json({
      users: { columns: userColumns, rows: userRows },
      communities: { columns: communityColumns, rows: communityRows },
      posts: { columns: postColumns, rows: postRows },
      comments: { columns: commentColumns, rows: commentRows },
    });
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
