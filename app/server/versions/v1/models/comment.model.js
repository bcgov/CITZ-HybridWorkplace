//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Comment:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Used to identify a specific comment.
 *        message:
 *          type: string
 *          description: Body of the comment.
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        creatorName:
 *          type: string
 *        creatorUsername:
 *          type: String
 *          description: The username of the creator.
 *        post:
 *          $ref: '#/components/schemas/Post/properties/id'
 *        createdOn:
 *          type: string
 *        hidden:
 *          type: boolean
 *          description: Comment will be hidden if true.
 *        removed:
 *          type: boolean
 *          description: Comment will be effectively removed in the view of a user if true.
 *        replyTo:
 *          type: string
 *          description: The id of the comment that is being replied to.
 *        hasReplies:
 *          type: boolean
 *          description: If the comment has replies.
 *        edits:
 *          type: array
 *          description: Edits made to the comment.
 *          items:
 *            type: object
 *            properties:
 *              timeStamp:
 *                type: string
 *              precursor:
 *                type: string
 *                description: The message before it was edited.
 *        upvotes:
 *          type: array
 *          description: Users that have upvoted the comment.
 *          items:
 *            type: object
 *            properties:
 *              count:
 *                type: number
 *              users:
 *                type: array
 *                items:
 *                  - $ref: '#/components/schemas/User'
 *        downvotes:
 *          type: array
 *          description: Users that have downvoted the comment.
 *          items:
 *            type: object
 *            properties:
 *              count:
 *                type: number
 *              users:
 *                type: array
 *                items:
 *                  - $ref: '#/components/schemas/User'
 *        flags:
 *          type: array
 *          description: Flags set by users to bring attention to moderators.
 *          items:
 *            type: object
 *            properties:
 *              flag:
 *                type: string
 *                example: Inappropriate
 *              flaggedBy:
 *                type: array
 *                description: Users that have flagged the comment.
 *                items:
 *                  type: string
 *      required:
 *        - message
 *        - creator
 *        - post
 *        - createdOn
 */

const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    message: { type: String, required: true },
    creator: { type: String, required: true },
    creatorName: { type: String },
    creatorUsername: { type: String },
    post: { type: String, required: true },
    community: { type: String, required: true },
    createdOn: { type: String, required: true },
    hidden: { type: Boolean },
    removed: { type: Boolean },
    replyTo: { type: String },
    hasReplies: { type: Boolean },
    edits: [{ precursor: String, timeStamp: String }],
    upvotes: {
      count: Number,
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    downvotes: {
      count: Number,
      users: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    flags: [
      {
        flag: String,
        flaggedBy: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { collection: "comment" }
);

const model = mongoose.model("Comment", Comment);

module.exports = model;
