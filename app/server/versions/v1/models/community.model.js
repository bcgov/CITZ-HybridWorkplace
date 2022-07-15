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
 *    Community:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          description: Title of the community.
 *          example: Welcome
 *        description:
 *          type: string
 *          description: Description of the community.
 *          example: Welcome to TheNeighbourhood
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        creatorName:
 *          type: string
 *          description: Full name of the creator.
 *        creatorUsername:
 *          type: String
 *          description: The username of the creator.
 *        latestActivity:
 *          type: string
 *          description: Date and time of last post or comment.
 *        memberCount:
 *          type: number
 *          description: Number of community members.
 *        members:
 *          type: array
 *          description: Users that have joined the community.
 *          items:
 *            - $ref: '#/components/schemas/User'
 *        createdOn:
 *          type: string
 *        rules:
 *          type: array
 *          description: Community rules set by moderators.
 *          items:
 *            type: object
 *            properties:
 *              rule:
 *                type: string
 *                example: Keep posts on topic.
 *              description:
 *                type: string
 *                example: Please keep posts on topic to "Agile".
 *        tags:
 *          type: array
 *          description: Tags set on posts in the community.
 *          items:
 *            type: object
 *            properties:
 *              tag:
 *                type: string
 *                example: Quick Read
 *              description:
 *                type: string
 *                example: Post can be read in a short amount of time.
 *              count:
 *                type: number
 *                example: 1
 *        flags:
 *          type: array
 *          description: Flags set by users to bring attention to admins.
 *          items:
 *            type: object
 *            properties:
 *              flag:
 *                type: string
 *                example: Inappropriate
 *              flaggedBy:
 *                type: array
 *                description: Users that have flagged the community.
 *                items:
 *                  - $ref: '#/components/schemas/User'
 *        moderators:
 *          type: array
 *          description: List of moderators.
 *          items:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              username:
 *                type: string
 *              name:
 *                type: string
 *                description: Full name.
 *              permissions:
 *                type: array
 *        kicked:
 *          type: array
 *          description: List of users who have been kicked from the community.
 *          items:
 *            type: object
 *            properties:
 *              userId:
 *                type: string
 *              period:
 *                type: string
 *                description: How long the user is kicked for (hour, day, week, forever).
 *              periodEnd:
 *                type: string
 *                description: When the user will be un-kicked.
 *      required:
 *        - title
 *        - description
 *        - creator
 *        - createdOn
 */

const mongoose = require("mongoose");

const Community = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    creator: { type: String, required: true },
    creatorName: { type: String },
    creatorUsername: { type: String },
    createdOn: { type: String, required: true },
    latestActivity: { type: String },
    memberCount: { type: Number },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    rules: [{ rule: String, description: String }],
    tags: [{ tag: String, description: String, count: Number }],
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
    moderators: [
      {
        userId: String,
        name: String,
        username: String,
        permissions: [String],
      },
    ],
    kicked: [
      {
        userId: String,
        period: String,
        periodEnd: String,
      },
    ],
  },
  { collection: "community" }
);

const model = mongoose.model("Community", Community);

module.exports = model;
