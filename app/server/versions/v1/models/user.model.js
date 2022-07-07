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
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Used as a reference to creator of a post or community.
 *        username:
 *          type: string
 *          description: User's IDIR username.
 *          example: sarah
 *        email:
 *          type: string
 *          description: User's email address.
 *          example: sarah@testgov.bc.ca
 *        password:
 *          type: string
 *          description: User's password.
 *          example: VerySecure123
 *          minimum: 8
 *        postCount:
 *          type: number
 *          description: Number of posts user has created.
 *        firstName:
 *          type: string
 *          description: User's first name (set in profile).
 *          example: Sarah
 *        lastName:
 *          type: string
 *          description: User's last name (set in profile).
 *          example: Grace
 *        title:
 *          type: string
 *          description: User's title (set in profile).
 *          example: Jr. Software Engineer
 *        ministry:
 *          type: string
 *          description: The ministry user is a part of.
 *        avatar:
 *          type: object
 *          description: Url to a profile avatar picture or an id of a default avatar.
 *          properties:
 *            type:
 *              type: string
 *              description: Initials, Person, Emoji, Upload.
 *              example: Initials
 *            image:
 *              type: string
 *              description: Image url.
 *            gradient:
 *              type: boolean
 *              description: Use gradient or just primary color.
 *            colors:
 *              type: object
 *              properties:
 *                primary:
 *                  type: string
 *                  description: Hex color code.
 *                secondary:
 *                  type: string
 *                  description: Hex color code.
 *        bio:
 *          type: string
 *          description: User's profile bio (set in profile).
 *          example: Hi I'm new! Just moved from the Ottawa
 *        registeredOn:
 *          type: string
 *        notificationFrequency:
 *          type: string
 *          description: none, immediate, daily, weekly, or monthly.
 *        isInMailingList:
 *          type: boolean
 *          description: Is in the gcNotify mailing list. ONLY REQUIRED When in TRIAL MODE.
 *        interests:
 *          type: array
 *          description: Topics the user is interested in.
 *          items:
 *            type: string
 *        communities:
 *          type: array
 *          description: Communities User has joined.
 *          items:
 *            type: object
 *            properties:
 *              community:
 *                $ref: '#/components/schemas/Community/properties/title'
 *              engagement:
 *                type: number
 *                description: Engagement in the community based on posts, comments, votes.
 *      required:
 *        - username
 *        - email
 *        - password
 *        - registeredOn
 */

const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    refreshToken: { type: String },
    postCount: { type: Number },
    firstName: { type: String },
    lastName: { type: String },
    title: { type: String },
    ministry: { type: String },
    avatar: {
      avatarType: String,
      image: String,
      gradient: Boolean,
      colors: { primary: String, secondary: String },
    },
    bio: { type: String },
    registeredOn: { type: String, required: true },
    communities: [{ community: String, engagement: Number }],
    notificationFrequency: { type: String },
    isInMailingList: { type: Boolean },
    interests: [String],
    darkMode: { type: Boolean },
  },
  { collection: "user" }
);

const model = mongoose.model("User", User);

module.exports = model;
