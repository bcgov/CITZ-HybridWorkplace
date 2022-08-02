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
const moment = require("moment");
const ResponseError = require("../classes/responseError");

const findSingleDocuments = require("../functions/findSingleDocuments");

const router = express.Router();

const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

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

    // Get data for status boxes
    req.log.addAction("Finding flagged communities.");
    const flaggedCommunities = await Community.aggregate([
      { $match: { flagCount: { $gt: 0 } } },
      { $project: { flagCount: 1, latestFlagTimestamp: 1, title: 1 } },
    ]);
    const flaggedCommunitiesCount = flaggedCommunities.length || 0;

    req.log.addAction("Finding flagged posts.");
    const flaggedPosts = await Post.aggregate([
      { $match: { flagCount: { $gt: 0 } } },
      { $project: { flagCount: 1, latestFlagTimestamp: 1, id: "$_id" } },
    ]);
    const flaggedPostsCount = flaggedPosts.length || 0;

    req.log.addAction("Finding flagged comments.");
    const flaggedComments = await Comment.aggregate([
      { $match: { flagCount: { $gt: 0 } } },
      { $project: { flagCount: 1, latestFlagTimestamp: 1, id: "$_id" } },
    ]);
    const flaggedCommentsCount = flaggedComments.length || 0;

    // Set latest flagged community
    req.log.addAction("Finding latest flagged community.");
    const now = moment();
    let latestFlaggedCommunityTimestamp;
    let latestFlaggedCommunityTitle = "";
    Object.keys(flaggedCommunities).forEach((community) => {
      const latest = flaggedCommunities[community].latestFlagTimestamp
        ? moment(
            moment(
              flaggedCommunities[community].latestFlagTimestamp,
              "MMMM Do YYYY, h:mm:ss a"
            ).toDate()
          )
        : null;
      if (!latestFlaggedCommunityTimestamp) {
        latestFlaggedCommunityTimestamp = latest;
        latestFlaggedCommunityTitle = flaggedCommunities[community].title;
      }
      if (
        latest &&
        now.diff(latest, "days", true) <
          now.diff(latestFlaggedCommunityTimestamp, "days", true)
      ) {
        latestFlaggedCommunityTitle = flaggedCommunities[community].title;
        latestFlaggedCommunityTimestamp = latest;
      }
    });

    req.log.addAction("Finding latest flagged post.");
    let latestFlaggedPostTimestamp;
    let latestFlaggedPostId = "";
    Object.keys(flaggedPosts).forEach((post) => {
      const latest = flaggedPosts[post].latestFlagTimestamp
        ? moment(
            moment(
              flaggedPosts[post].latestFlagTimestamp,
              "MMMM Do YYYY, h:mm:ss a"
            ).toDate()
          )
        : null;
      if (!latestFlaggedPostTimestamp) {
        latestFlaggedPostTimestamp = latest;
        latestFlaggedPostId = flaggedPosts[post].id;
      }
      if (
        latest &&
        now.diff(latest, "days", true) <
          now.diff(latestFlaggedPostTimestamp, "days", true)
      ) {
        latestFlaggedPostId = flaggedPosts[post].id;
        latestFlaggedPostTimestamp = latest;
      }
    });

    req.log.addAction("Finding latest flagged comment.");
    let latestFlaggedCommentTimestamp;
    let latestFlaggedCommentId = "";
    Object.keys(flaggedComments).forEach((comment) => {
      const latest = flaggedComments[comment].latestFlagTimestamp
        ? moment(
            moment(
              flaggedComments[comment].latestFlagTimestamp,
              "MMMM Do YYYY, h:mm:ss a"
            ).toDate()
          )
        : null;
      if (!latestFlaggedCommentTimestamp) {
        latestFlaggedCommentTimestamp = latest;
        latestFlaggedCommentId = flaggedComments[comment].id;
      }
      if (
        latest &&
        now.diff(latest, "days", true) <
          now.diff(latestFlaggedCommentTimestamp, "days", true)
      ) {
        latestFlaggedCommentId = flaggedComments[comment].id;
        latestFlaggedCommentTimestamp = latest;
      }
    });

    // Get data for data grids
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

    req.log.setResponse(200, "Success");
    return res.status(200).json({
      status: {
        communities: {
          flagCount: flaggedCommunitiesCount,
          latest: latestFlaggedCommunityTimestamp
            ? moment(latestFlaggedCommunityTimestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )
            : "",
          identifier: latestFlaggedCommunityTitle,
        },
        posts: {
          flagCount: flaggedPostsCount,
          latest: latestFlaggedPostTimestamp
            ? moment(latestFlaggedPostTimestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )
            : "",
          identifier: latestFlaggedPostId,
        },
        comments: {
          flagCount: flaggedCommentsCount,
          latest: latestFlaggedCommentTimestamp
            ? moment(latestFlaggedCommentTimestamp).format(
                "MMMM Do YYYY, h:mm:ss a"
              )
            : "",
          identifier: latestFlaggedCommentId,
        },
      },
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
