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
const { ObjectId } = require("mongodb");
const ResponseError = require("../classes/responseError");

const checkPatchQuery = require("../functions/checkPatchQuery");
const findSingleDocuments = require("../functions/findSingleDocuments");
const getOptions = require("../functions/getOptions");
const trimExtraSpaces = require("../functions/trimExtraSpaces");

const router = express.Router();

const User = require("../models/user.model");
const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

/**
 * @swagger
 * paths:
 *  /api/user:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Get user.
 *      description: Returns properties of user that have been set.
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Successfully found user. Returns the following properties if set.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    $ref: '#/components/schemas/User/properties/username'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  firstName:
 *                    $ref: '#/components/schemas/User/properties/firstName'
 *                  lastName:
 *                    $ref: '#/components/schemas/User/properties/lastName'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *                  interests:
 *                    $ref: '#/components/schemas/User/properties/interests'
 *                  avatar:
 *                    $ref: '#/components/schemas/User/properties/avatar'
 *        '400':
 *          description: Bad Request.
 */

// Get user
router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    req.log.addAction("Getting community information.");
    const communities = await Community.aggregate([
      { $match: { removed: false } },
      {
        $lookup: {
          from: "user",
          let: { community_title: "$title" },
          pipeline: [
            {
              $unwind: "$communities",
            },
            {
              $match: {
                username: user.username,
                $expr: {
                  $and: [
                    { $eq: ["$communities.community", "$$community_title"] },
                  ],
                },
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $addFields: {
          engagement: {
            $ifNull: [{ $sum: ["$userData.communities.engagement"] }, 0],
          },
        },
      },
      {
        $project: {
          title: 1,
          createdOn: 1,
          latestActivity: 1,
          engagement: 1,
          members: 1,
          memberCount: 1,
          description: 1,
        },
      },
      {
        $match: {
          members: new ObjectId(user.id),
        },
      },
      { $sort: { engagement: -1, _id: -1 } },
    ]).exec();
    req.log.addAction("Got community information.");

    req.log.setResponse(200, "Success");
    return res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      title: user.title,
      ministry: user.ministry,
      avatar: user.avatar,
      registeredOn: user.registeredOn,
      postCount: user.postCount,
      notificationFrequency: user.notificationFrequency,
      interests: user.interests,
      communities,
    });
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/user:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Edit user.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                email:
 *                  $ref: '#/components/schemas/User/properties/email'
 *                firstName:
 *                  $ref: '#/components/schemas/User/properties/firstName'
 *                lastName:
 *                  $ref: '#/components/schemas/User/properties/lastName'
 *                bio:
 *                  $ref: '#/components/schemas/User/properties/bio'
 *                title:
 *                  $ref: '#/components/schemas/User/properties/title'
 *                ministry:
 *                  $ref: '#/components/schemas/User/properties/ministry'
 *                notificationFrequency:
 *                  $ref: '#/components/schemas/User/properties/notificationFrequency'
 *                avatar:
 *                  $ref: '#/components/schemas/User/properties/avatar'
 *                interests:
 *                    $ref: '#/components/schemas/User/properties/interests'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: One of the fields you tried to edit, can not be edited.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Edit user
router.patch("/", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.user.username,
    });
    req.log.addAction("User found.");

    // Admin can set other user
    let otherUser;
    if (
      req.user.role === "admin" &&
      req.query.username &&
      req.query.username !== ""
    )
      otherUser = await User.findOne({ username: req.query.username });

    req.log.addAction("Finding user options.");
    const {
      firstNameMinLength,
      firstNameMaxLength,
      lastNameMinLength,
      lastNameMaxLength,
      bioMinLength,
      bioMaxLength,
      titleMinLength,
      titleMaxLength,
      ministryMinLength,
      ministryMaxLength,
      interestMinLength,
      interestMaxLength,
    } = await getOptions("user");
    req.log.addAction("User options found.");

    req.log.addAction("Finding notification options.");
    const { frequencies } = await getOptions("notifications");
    req.log.addAction("Notification options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces from inputs in request body.");
    if (req.body.bio) req.body.bio = trimExtraSpaces(req.body.bio);
    req.log.addAction(`bio trimmed: ${req.body.bio}`);
    if (req.body.title) req.body.title = trimExtraSpaces(req.body.title);
    req.log.addAction(`title trimmed: ${req.body.title}`);
    if (req.body.ministry)
      req.body.ministry = trimExtraSpaces(req.body.ministry);
    req.log.addAction(`ministry trimmed: ${req.body.ministry}`);

    // Validate email
    if (req.body.email) {
      req.log.addAction("Validating email.");
      const emailPattern = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailPattern.test(req.body.email))
        throw new ResponseError(403, "Invalid email.");
      req.log.addAction("Email is valid.");
    }

    // Validate firstName
    const firstNameRegexStr = `(?!.*\\s).{${firstNameMinLength},${firstNameMaxLength}}`;
    const firstNamePattern = new RegExp(firstNameRegexStr, "g");
    const firstNameError = `firstName does not meet requirements: length ${firstNameMinLength}-${firstNameMaxLength}, must not contain whitespace.`;
    req.log.addAction("Validating firstName.");
    if (req.body.firstName && !firstNamePattern.test(req.body.firstName))
      throw new ResponseError(403, firstNameError);
    req.log.addAction("firstName is valid.");

    // Validate lastName
    const lastNameRegexStr = `(?!.*\\s).{${lastNameMinLength},${lastNameMaxLength}}`;
    const lastNamePattern = new RegExp(lastNameRegexStr, "g");
    const lastNameError = `lastName does not meet requirements: length ${lastNameMinLength}-${lastNameMaxLength}, must not contain whitespace.`;
    req.log.addAction("Validating lastName.");
    if (req.body.lastName && !lastNamePattern.test(req.body.lastName))
      throw new ResponseError(403, lastNameError);
    req.log.addAction("lastName is valid.");

    // Validate bio
    const bioError = `bio does not meet requirements: length ${bioMinLength}-${bioMaxLength}.`;
    req.log.addAction("Validating bio.");
    if (
      req.body.bio &&
      (req.body.bio.length < bioMinLength || req.body.bio.length > bioMaxLength)
    )
      throw new ResponseError(403, bioError);
    req.log.addAction("bio is valid.");

    // Validate title
    const titleError = `title does not meet requirements: length ${titleMinLength}-${titleMaxLength}.`;
    req.log.addAction("Validating title.");
    if (
      req.body.title &&
      (req.body.title.length < titleMinLength ||
        req.body.title.length > titleMaxLength)
    )
      throw new ResponseError(403, titleError);
    req.log.addAction("title is valid.");

    // Validate ministry
    const ministryError = `ministry does not meet requirements: length ${ministryMinLength}-${ministryMaxLength}.`;
    req.log.addAction("Validating ministry.");
    if (
      req.body.ministry &&
      (req.body.ministry.length < ministryMinLength ||
        req.body.ministry.length > ministryMaxLength)
    )
      throw new ResponseError(403, ministryError);
    req.log.addAction("ministry is valid.");

    // Validate and trim interests
    if (req.body.interests && req.body.interests instanceof Array) {
      Object.keys(req.body.interests).forEach((interest) => {
        // Trim extra spaces
        req.body.interests[interest] = trimExtraSpaces(
          req.body.interests[interest]
        );
        // Validate length
        if (
          req.body.interests[interest].length < interestMinLength ||
          req.body.interests[interest].length > interestMaxLength
        )
          throw new ResponseError(
            403,
            `Interests (${req.body.interests[interest]}) must have a length of ${interestMinLength}-${interestMaxLength}`
          );
      });
    }

    if (req.body.notificationFrequency) {
      if (!frequencies.includes(req.body.notificationFrequency.toLowerCase())) {
        // Validate notificationFrequency
        throw new ResponseError(
          403,
          `notificationFrequency must be one of ${JSON.stringify(frequencies)}`
        );
      }
      req.body.notificationFrequency =
        req.body.notificationFrequency.toLowerCase();
    }

    // Check patch query for disallowed fields
    req.log.addAction("Checking edit query.");
    const query =
      user.role === "admin"
        ? req.body
        : checkPatchQuery(req.body, user, [
            "username",
            "password",
            "refreshToken",
            "registeredOn",
            "communities",
            "postCount",
            "isInMailingList",
            "role",
          ]);
    req.log.addAction("Edit query has been cleaned.");

    // Set fullName
    const firstName = otherUser
      ? otherUser.firstName
      : req.body.firstName || user.firstName;
    const lastName = otherUser
      ? otherUser.lastName
      : req.body.lastName || user.lastName;

    // If first or last name was set in request body
    // and firstName is set either in the request body or in the database.
    if (
      (req.body.firstName || req.body.lastName) &&
      firstName &&
      firstName !== ""
    ) {
      // If last name set in req.body or database, set full name, else just first name
      const fullName =
        lastName && lastName !== ""
          ? `${firstName} ${lastName}`
          : firstName || user.username;

      if (otherUser) {
        await Comment.updateMany(
          { creator: otherUser.id },
          { $set: { creatorName: fullName } }
        );
        await Post.updateMany(
          { creator: otherUser.id },
          { $set: { creatorName: fullName } }
        );
        await Community.updateMany(
          { creator: otherUser.id },
          { $set: { creatorName: fullName } }
        );
        await Community.updateMany(
          { moderators: { $elemMatch: { userId: otherUser.id } } },
          { $set: { "moderators.$.name": fullName } }
        );
      } else {
        await Comment.updateMany(
          { creator: user.id },
          { $set: { creatorName: fullName } }
        );
        await Post.updateMany(
          { creator: user.id },
          { $set: { creatorName: fullName } }
        );
        await Community.updateMany(
          { creator: user.id },
          { $set: { creatorName: fullName } }
        );
        await Community.updateMany(
          { moderators: { $elemMatch: { userId: user.id } } },
          { $set: { "moderators.$.name": fullName } }
        );
      }
    }

    if (otherUser) {
      req.log.addAction("Updating user.");
      await User.updateOne({ _id: otherUser.id }, query).exec();
      req.log.addAction("User updated.");
    } else {
      req.log.addAction("Updating user.");
      await User.updateOne({ _id: user.id }, query).exec();
      req.log.addAction("User updated.");
    }

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{username}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Get user by username.
 *      description: Returns properties of user that have been set.
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/username'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '200':
 *          description: Successfully found user.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  username:
 *                    $ref: '#/components/schemas/User/properties/username'
 *                  email:
 *                    $ref: '#/components/schemas/User/properties/email'
 *                  firstName:
 *                    $ref: '#/components/schemas/User/properties/firstName'
 *                  lastName:
 *                    $ref: '#/components/schemas/User/properties/lastName'
 *                  bio:
 *                    $ref: '#/components/schemas/User/properties/bio'
 *                  title:
 *                    $ref: '#/components/schemas/User/properties/title'
 *                  interests:
 *                    $ref: '#/components/schemas/User/properties/interests'
 *                  avatar:
 *                    $ref: '#/components/schemas/User/properties/avatar'
 *        '400':
 *          description: Bad Request.
 */

// Get user by username
router.get("/:username", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.params.username,
    });
    req.log.addAction("User found.");

    req.log.addAction("Getting community information.");
    const communities = await Community.aggregate([
      { $match: { removed: false } },
      {
        $lookup: {
          from: "user",
          let: { community_title: "$title" },
          pipeline: [
            {
              $unwind: "$communities",
            },
            {
              $match: {
                username: user.username,
                $expr: {
                  $and: [
                    { $eq: ["$communities.community", "$$community_title"] },
                  ],
                },
              },
            },
          ],
          as: "userData",
        },
      },
      {
        $addFields: {
          engagement: {
            $ifNull: [{ $sum: ["$userData.communities.engagement"] }, 0],
          },
        },
      },
      {
        $project: {
          title: 1,
          createdOn: 1,
          latestActivity: 1,
          engagement: 1,
          members: 1,
          memberCount: 1,
          description: 1,
        },
      },
      {
        $match: {
          members: new ObjectId(user.id),
        },
      },
      { $sort: { engagement: -1, _id: -1 } },
    ]).exec();
    req.log.addAction("Got community information.");

    req.log.setResponse(200, "Success");
    return res.status(200).json({
      username: user.username,
      email: user.email,
      role: user.role,
      online: user.online,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      title: user.title,
      ministry: user.ministry,
      avatar: user.avatar,
      registeredOn: user.registeredOn,
      postCount: user.postCount,
      notificationFrequency: user.notificationFrequency,
      interests: user.interests,
      communities,
    });
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/user/{username}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - User
 *      summary: Remove user by username.
 *      parameters:
 *        - in: path
 *          name: username
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User/properties/username'
 *      responses:
 *        '404':
 *          description: User not found.
 *        '403':
 *          description: Must be account owner to remove user.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove user by username
router.delete("/:username", async (req, res, next) => {
  try {
    req.log.addAction("Finding user.");
    const { user } = await findSingleDocuments({
      user: req.params.username,
    });
    req.log.addAction("User found.");

    const requestingUser = await User.findOne({ username: req.user.username });

    req.log.addAction("Checking user is account owner.");
    if (
      !(user.username === req.user.username || requestingUser.role === "admin")
    )
      throw new ResponseError(403, "Must be account owner to remove user.");
    req.log.addAction("User is account owner.");

    req.log.addAction("Removing user.");
    await User.deleteOne({ username: user.username }).exec();
    req.log.addAction("User removed.");

    // TODO: Remove user's posts and communities
    // TODO: What happens if user is the only moderator of a community when user is deleted

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
