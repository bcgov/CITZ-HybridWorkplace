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
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Used to identify a specific post.
 *        title:
 *          type: string
 *          description: Title of the post.
 *          example: What is DevOps?
 *        message:
 *          type: string
 *          description: Body of the post.
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        creatorName:
 *          type: String
 *          description: The full name of the creator.
 *        community:
 *          $ref: '#/components/schemas/Community/properties/title'
 *        pinned:
 *          type: boolean
 *          description: Pinned posts show at the top of the feed. Limit 3 per community.
 *        createdOn:
 *          type: string
 *        commentCount:
 *          type: number
 *        availableTags:
 *          type: array
 *          description: Tags set by moderators of the community.
 *          items:
 *            type: string
 *        tags:
 *          type: array
 *          description: Tags set by users to describe post.
 *          items:
 *            type: object
 *            properties:
 *              tag:
 *                type: string
 *                example: Informative
 *              taggedBy:
 *                type: array
 *                description: Users that have tagged the post.
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
 *                description: Users that have flagged the post.
 *                items:
 *                  - $ref: '#/components/schemas/User'
 *      required:
 *        - title
 *        - message
 *        - creator
 *        - community
 *        - createdOn
 */

const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    creator: { type: String, required: true },
    creatorName: { type: String },
    community: { type: String, required: true },
    pinned: { type: Boolean },
    createdOn: { type: String, required: true },
    commentCount: { type: Number },
    availableTags: [String],
    tags: [
      {
        tag: String,
        taggedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
    flags: [
      {
        flag: String,
        flaggedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
  },
  { collection: "post" }
);

const model = mongoose.model("Post", Post);

module.exports = model;
