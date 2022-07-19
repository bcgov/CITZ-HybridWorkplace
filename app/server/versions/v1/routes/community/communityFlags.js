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
const getOptions = require("../../functions/getOptions");

const router = express.Router();

const Community = require("../../models/community.model");

/**
 * @swagger
 * paths:
 *  /api/community/flags/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Flags
 *      summary: Get community flags by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: "#/components/schemas/Community/properties/title"
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          description: Community successfully found.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community/properties/flags'
 *        '400':
 *          description: Bad Request.
 */

// Get community flags by community title
router.get("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding community.");
    const { community } = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(community.flags);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/flags/{title}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Flags
 *      summary: Flag community by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: Invalid flag. Use one of <br>[Inappropriate, Hate, Harassment or Bullying, Spam, Misinformation, Against Community Rules]
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Flag community by community title
// TODO: Allow setting of multiple flags at once
router.post("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Finding flags in options.");
    const { flags } = await getOptions("flags");
    req.log.addAction("Flags in options found.");

    req.log.addAction("Checking flag is valid.");
    if (!flags.includes(req.query.flag))
      throw new ResponseError(403, `Invalid flag. Use one of ${flags}`);
    req.log.addAction("Flag is valid.");

    // If flag isn't set on community
    req.log.addAction("Updating community flags.");
    if (
      !(await Community.exists({
        title: community.title,
        "flags.flag": req.query.flag,
      }))
    ) {
      // Create flag
      req.log.addAction("Adding flag to community.");
      await Community.updateOne(
        { title: community.title },
        {
          $push: {
            flags: { flag: req.query.flag, flaggedBy: [user.username] },
          },
        }
      );
    } else {
      // Add user to flaggedBy
      req.log.addAction("Adding user to flaggedBy.");
      await Community.updateOne(
        {
          title: community.title,
          flags: { $elemMatch: { flag: req.query.flag } },
        },
        { $addToSet: { "flags.$.flaggedBy": [user.username] } }
      );
    }
    req.log.addAction("Community flag set.");

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
 *  /api/community/flags/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Flags
 *      summary: Unset flag on community by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: flag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/flags/items/properties/flag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Flag not found in query.
 *        '403':
 *          description: User has not flagged community with specified flag.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Unset flag on community by community title
router.delete("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking flag query.");
    if (!req.query.flag || req.query.flag === "")
      throw new ResponseError(404, "Flag not found in query.");

    // Check user has flagged community
    req.log.addAction("Checking user has flagged community.");
    if (
      !(await Community.exists({
        title: community.title,
        "flags.flag": req.query.flag,
        "flags.flaggedBy": user.username,
      }))
    )
      throw new ResponseError(
        403,
        `User has not flagged community with ${req.query.flag}.`
      );

    // Remove user from flaggedBy
    req.log.addAction("Removing user from flaggedBy.");
    await Community.updateOne(
      {
        title: community.title,
        flags: { $elemMatch: { flag: req.query.flag } },
      },
      { $pull: { "flags.$.flaggedBy": user.username } }
    );
    req.log.addAction("User removed from flaggedBy.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
