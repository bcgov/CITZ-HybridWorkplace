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
 *        post:
 *          $ref: '#/components/schemas/Post/properties/id'
 *        createdOn:
 *          type: string
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
    post: { type: String, required: true },
    community: { type: String, required: true },
    createdOn: { type: String, required: true },
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
  },
  { collection: "comment" }
);

const model = mongoose.model("Comment", Comment);

module.exports = model;
