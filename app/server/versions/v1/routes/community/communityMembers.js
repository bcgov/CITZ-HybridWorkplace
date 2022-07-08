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
const ResponseError = require("../../classes/responseError");
const findSingleDocuments = require("../../functions/findSingleDocuments");

const router = express.Router();

const Community = require("../../models/community.model");
const User = require("../../models/user.model");

/**
 * @swagger
 * paths:
 *  /api/community/members/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Get all community members by community title or members count.
 *      description: Use optional query 'count=true' to get member count.
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
 *                $ref: '#/components/schemas/Community/properties/members'
 *        '400':
 *          description: Bad Request.
 */

// Get all community members by community title or count
router.get("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking count query.");
    if (req.query.count === "true")
      return res.status(200).json({ count: community.members.length || 0 });

    req.log.setResponse(204, "Success", null);
    return res.status(200).json(community.members);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/members/join/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Join community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: User is already a member of community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Join community by title
router.patch("/join/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking if user is member of community.");
    if (
      await Community.exists({
        title: community.title,
        members: user.id,
      })
    )
      throw new ResponseError(403, "User is already a member of community.");
    req.log.addAction("User is not a member of community.");

    req.log.addAction("Updating community members.");
    await Community.updateOne(
      { title: community.title },
      { $addToSet: { members: user.id }, $inc: { memberCount: 1 } }
    );
    req.log.addAction("Community members updated.");

    req.log.addAction("Updating user community list.");
    await User.updateOne(
      { username: user.username },
      {
        $addToSet: {
          communities: { community: community.title, engagement: 0 },
        },
      }
    );
    req.log.addAction("User community list updated.");

    req.log.setResponse(204, "Success", null);
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
 *  /api/community/members/leave/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Members
 *      summary: Leave community by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Leave community by title
router.delete("/leave/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    // Remove user from community
    req.log.addAction("Removing user from community members.");
    await Community.updateOne(
      { title: community.title },
      { $pull: { members: user.id }, $inc: { memberCount: -1 } }
    );
    req.log.addAction("User removed from community members.");

    // Remove community from user's communities array
    req.log.addAction("Removing community from user's community list.");
    await User.updateOne(
      { username: user.username },
      {
        $pull: {
          communities: { community: community.title },
        },
      }
    );
    req.log.addAction("Community removed from user's community list.");

    req.log.addAction("Checking if user is a moderator.");
    if (community.moderators.includes(user.id)) {
      await Community.updateOne(
        { title: community.title },
        { $pull: { moderators: user.id } }
      );
      req.log.addAction("Removed user from moderators.");
    }
    req.log.addAction("Checked if user is moderator.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
