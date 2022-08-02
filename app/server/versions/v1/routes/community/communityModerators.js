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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

const express = require("express");
const moment = require("moment");
const ResponseError = require("../../classes/responseError");

const findSingleDocuments = require("../../functions/findSingleDocuments");
const checkUserIsMemberOfCommunity = require("../../functions/checkUserIsMemberOfCommunity");
const getFullName = require("../../functions/getFullName");
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

const router = express.Router();

const Community = require("../../models/community.model");
const User = require("../../models/user.model");

const communityUnKick = require("../../jobs/communityUnKick");
const { agenda } = require("../../../../db");

/**
 * @swagger
 * paths:
 *  /api/community/moderators/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Get all community moderators by community title or moderator count.
 *      description: Use optional query 'count=true' to get moderators count.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: false
 *          name: count
 *          schema:
 *            type: boolean
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community/properties/moderators'
 *        '400':
 *          description: Bad Request.
 */

// Get all community moderators by community title
router.get("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding community.");
    const { community } = await findSingleDocuments(
      {
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("Community found.");

    req.log.addAction("Checking count query.");
    if (req.query.count === "true")
      return res.status(200).json({ count: community.moderators.length || 0 });

    req.log.setResponse(204, "Success");
    return res.status(200).json(community.moderators);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/moderators/add/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Add moderator by community title.
 *      description: Only moderators with permission "set_moderators" can add moderators.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                permissions:
 *                  type: array
 *                  items:
 *                    type: string
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Moderator username not found.
 *        '403':
 *          description: Only moderators with permission "set_moderators" can set moderators of community. **||** <br>User is already a moderator. **||** <br>Moderator user must be member of community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Add moderator by community title
router.patch("/add/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction(
      "Checking user is moderator of community and has right permissions."
    );
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title,
          req.body.permissions && req.body.permissions.length > 0
            ? ["set_moderators", "set_permissions"]
            : ["set_moderators"]
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderators with permission: 'set_moderators' can set moderators of community."
      );
    req.log.addAction(
      "User is moderator of community with the right permissions."
    );

    req.log.addAction("Finding moderator user data.");
    const moderator = await User.findOne({ username: req.body.username });
    if (!moderator)
      throw new ResponseError(404, "Moderator username not found.");
    await checkUserIsMemberOfCommunity(moderator, community.title);
    req.log.addAction("Moderator user data found.");

    req.log.addAction("Checking if user is already a moderator.");
    if (
      await communityAuthorization.isCommunityModerator(
        moderator.username,
        community.title
      )
    )
      throw new ResponseError(403, "User is already a moderator.");
    req.log.addAction("User is not already a moderator.");

    req.log.addAction("Updating community moderators.");
    await Community.updateOne(
      { title: community.title },
      {
        $push: {
          moderators: {
            userId: moderator.id,
            name: getFullName(moderator) || moderator.username,
            username: moderator.username,
            permissions: req.body.permissions,
          },
        },
      }
    );
    req.log.addAction("Community moderators updated.");

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
 *  /api/community/moderators/remove/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Remove moderator by community title.
 *      description: Only moderators with permission "set_moderators" can remove moderators.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Moderator username not found.
 *        '403':
 *          description: Only moderators with permission "set_moderators" can set moderators of community. **||** <br>Not allowed to remove moderator with permission 'set_permissions' when no other moderators have the 'set_permissions' permission. This is to prevent a 'lockout' situation where no moderators have any permissions
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove moderator by community title
router.delete("/remove/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction(
      "Checking user is moderator of community and has right permissions."
    );
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title,
          ["set_moderators"]
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderators with permission: 'set_moderators' can set moderators of community."
      );
    req.log.addAction(
      "User is moderator of community with the right permissions."
    );

    req.log.addAction("Finding moderator user data.");
    const moderator = await User.findOne({ username: req.body.username });
    if (!moderator)
      throw new ResponseError(404, "Moderator username not found.");
    req.log.addAction("Moderator user data found.");

    req.log.addAction(
      "Finding number of moderators with 'set_permissions' permission."
    );
    // Find number of moderators with permission "set_permissions"
    const permissionsSet = await Community.aggregate([
      { $match: { title: community.title } },
      { $unwind: "$moderators" },
      { $match: { "moderators.permissions": "set_permissions" } },
      {
        $group: {
          _id: "set_permissions",
          total: { $sum: 1 },
        },
      },
    ]);
    const modsWSetPermissions = permissionsSet[0].total;

    req.log.addAction("Finding moderator's permissions.");
    let moderatorPermissions = [];
    Object.keys(community.moderators).forEach((key) => {
      if (community.moderators[key].username === moderator.username) {
        moderatorPermissions = community.moderators[key].permissions;
      }
    });

    req.log.addAction("Checking for permission lockout situation.");
    if (
      modsWSetPermissions === 1 &&
      moderatorPermissions.includes("set_permissions")
    )
      throw new ResponseError(
        403,
        `Not allowed to remove moderator with permission 'set_permissions' when no other moderators 
have the 'set_permissions' permission. This is to prevent a 'lockout' situation where 
no moderators have any permissions.`
      );
    req.log.addAction("Permission lockout sitaution will not happen.");

    req.log.addAction("Updating community moderators.");
    await Community.updateOne(
      { title: community.title },
      {
        $pull: {
          moderators: {
            username: moderator.username,
          },
        },
      }
    );
    req.log.addAction("Community moderators updated.");

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
 *  /api/community/moderators/permissions/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Set moderator permissions by community title.
 *      description: Only moderators with permission "set_permissions" can set moderator permissions.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                permissions:
 *                  type: array
 *                  items:
 *                    type: string
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Moderator username not found.
 *        '403':
 *          description: Only moderators with permission "set_permissions" can set moderator permissions. **||** <br>Not allowed to remove permission 'set_permissions' when no other moderators have the 'set_permissions' permission. This is to prevent a 'lockout' situation where no moderators have any permissions.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Set moderator permissions by community title
router.patch("/permissions/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction(
      "Checking user is moderator of community and has right permissions."
    );
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title,
          ["set_permissions"]
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderators with permission: 'set_permissions' can set moderator permissions."
      );
    req.log.addAction(
      "User is moderator of community with the right permissions."
    );

    req.log.addAction("Finding moderator user data.");
    const moderator = await User.findOne({ username: req.body.username });
    if (!moderator)
      throw new ResponseError(404, "Moderator username not found.");
    req.log.addAction("Moderator user data found.");

    req.log.addAction(
      "Finding number of moderators with 'set_permissions' permission."
    );
    // Find number of moderators with permission "set_permissions"
    const permissionsSet = await Community.aggregate([
      { $match: { title: community.title } },
      { $unwind: "$moderators" },
      { $match: { "moderators.permissions": "set_permissions" } },
      {
        $group: {
          _id: "set_permissions",
          total: { $sum: 1 },
        },
      },
    ]);
    const modsWSetPermissions = permissionsSet[0].total;

    req.log.addAction("Finding moderator's permissions.");
    let moderatorPermissions = [];
    Object.keys(community.moderators).forEach((key) => {
      if (community.moderators[key].username === moderator.username) {
        moderatorPermissions = community.moderators[key].permissions;
      }
    });

    req.log.addAction("Checking for permission lockout situation.");
    const reqBodyPerms = req.body.permissions;
    if (
      modsWSetPermissions === 1 &&
      moderatorPermissions.includes("set_permissions") &&
      (!reqBodyPerms ||
        reqBodyPerms.length === 0 ||
        !reqBodyPerms.includes("set_permissions"))
    )
      throw new ResponseError(
        403,
        `Not allowed to remove permission 'set_permissions' when no other moderators 
have the 'set_permissions' permission. This is to prevent a 'lockout' situation where 
no moderators have any permissions.`
      );
    req.log.addAction("Permission lockout sitaution will not happen.");

    req.log.addAction("Updating community moderators.");
    await Community.updateOne(
      {
        title: community.title,
        moderators: { $elemMatch: { username: moderator.username } },
      },
      {
        $set: { "moderators.$.permissions": req.body.permissions },
      }
    );
    req.log.addAction("Community moderators updated.");

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
 *  /api/community/moderators/kick/{title}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Kick user from community.
 *      description: Field "period" can any one of ["hour", "day", "week", "forever"].
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                username:
 *                  $ref: '#/components/schemas/User/properties/username'
 *                period:
 *                  $ref: '#/components/schemas/Community/properties/kicked/properties/period'
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Kick user username not found.
 *        '403':
 *          description: Only moderators can kick members. **||** <br>Field 'period' in request body is missing or invalid. **||** <br>Remove user as a moderator before kicking.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Kick user from community
router.post("/kick/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments(
      {
        user: req.user.username,
        community: req.params.title,
      },
      req.user.role === "admin"
    );
    req.log.addAction("User and community found.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(403, "Only moderators can kick members.");
    req.log.addAction("User is moderator of community.");

    req.log.addAction("Finding kick user's user data.");
    const kickUser = await User.findOne({ username: req.body.username });
    if (!kickUser)
      throw new ResponseError(404, "Kick user username not found.");
    req.log.addAction("Kick user's user data found.");

    req.log.addAction("Checking if kick user is moderator of community.");
    if (
      await communityAuthorization.isCommunityModerator(
        kickUser.username,
        community.title
      )
    )
      throw new ResponseError(
        403,
        "Remove user as a moderator before kicking."
      );
    req.log.addAction("Kick user is not a moderator of community.");

    req.log.addAction("Checking for 'period' value from request body.");
    let periodEnd;
    if (!req.body.period)
      throw new ResponseError(
        403,
        "Field 'period' in request body is missing."
      );

    // Define job for kicking user
    await communityUnKick(agenda, community.title, kickUser.id);
    switch (req.body.period) {
      // TODO: REMOVE TEST CASE
      case "test":
        periodEnd = moment()
          .add(5, "minutes")
          .format("MMMM Do YYYY, h:mm:ss a");
        await agenda.schedule(
          "in 5 minutes",
          `communityUnKick-${community.title}-${kickUser.id}`
        );
        break;
      case "hour":
        periodEnd = moment().add(1, "hour").format("MMMM Do YYYY, h:mm:ss a");
        await agenda.schedule(
          "in 1 hour",
          `communityUnKick-${community.title}-${kickUser.id}`
        );
        break;
      case "day":
        periodEnd = moment().add(1, "days").format("MMMM Do YYYY, h:mm:ss a");
        await agenda.schedule(
          "in 1 day",
          `communityUnKick-${community.title}-${kickUser.id}`
        );
        break;
      case "week":
        periodEnd = moment().add(1, "week").format("MMMM Do YYYY, h:mm:ss a");
        await agenda.schedule(
          "in 1 week",
          `communityUnKick-${community.title}-${kickUser.id}`
        );
        break;
      case "forever":
        periodEnd = "N/A";
        break;
      default:
        throw new ResponseError(
          403,
          "Field 'period' in request body is missing or invalid."
        );
    }

    req.log.addAction("Updating community kicked users.");
    await Community.updateOne(
      { title: community.title },
      {
        $push: {
          kicked: { userId: kickUser.id, period: req.body.period, periodEnd },
        },
      }
    );
    req.log.addAction("Community kicked users updated.");

    // Remove user from community
    req.log.addAction("Removing user from community members.");
    await Community.updateOne(
      { title: community.title },
      { $pull: { members: kickUser.id }, $inc: { memberCount: -1 } }
    );
    req.log.addAction("User removed from community members.");

    // Remove community from user's communities array
    req.log.addAction("Removing community from user's community list.");
    await User.updateOne(
      { username: kickUser.username },
      {
        $pull: {
          communities: { community: community.title },
        },
      }
    );
    req.log.addAction("Community removed from user's community list.");

    req.log.setResponse(204, "Success");
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
