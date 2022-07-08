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
const trimExtraSpaces = require("../../functions/trimExtraSpaces");
const getOptions = require("../../functions/getOptions");

const router = express.Router();

const Community = require("../../models/community.model");
const Post = require("../../models/post.model");
const {
  communityAuthorization,
} = require("../../authorization/communityAuthorization");

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Get community tags by title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      responses:
 *        '404':
 *          description: Community not found.
 *        '200':
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Community/properties/tags'
 *        '400':
 *          description: Bad Request.
 */

// Get community tags by title
router.get("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding community.");
    const { community } = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(community.tags);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/tags/{title}:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Create community tag by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                tag:
 *                  $ref: '#/components/schemas/Community/properties/tags/items/properties/tag'
 *                description:
 *                  $ref: '#/components/schemas/Community/properties/tags/items/properties/description'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: A community can't have more than 7 tags. **||** <br>No duplicate tags. **||** <br>Only moderator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Create community tag by community title
router.post("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Finding options.");
    const {
      tagMinLength,
      tagMaxLength,
      tagDescriptionMinLength,
      tagDescriptionMaxLength,
    } = await getOptions("community");
    req.log.addAction("Options found.");

    // Trim extra spaces
    req.log.addAction("Trimming extra spaces.");
    req.body.tag = trimExtraSpaces(req.body.tag);
    req.body.description = trimExtraSpaces(req.body.description);
    req.log.addAction(
      `Extra spaces trimmed. tag: ${req.body.tag}, description: ${req.body.description}`
    );

    req.log.addAction("Validating tag and description.");
    // Validate tag length
    if (
      req.body.tag.length < tagMinLength ||
      req.body.tag.length > tagMaxLength
    )
      throw new ResponseError(
        403,
        `Tags (${req.body.tag}) must have a length of ${tagMinLength}-${tagMaxLength}`
      );

    // Validate tag description length
    if (
      req.body.description &&
      (req.body.description.length < tagDescriptionMinLength ||
        req.body.description.length > tagDescriptionMaxLength)
    )
      throw new ResponseError(
        403,
        `Tags (${req.body.tag}) description must have a length of ${tagDescriptionMinLength}-${tagDescriptionMaxLength}`
      );
    req.log.addAction("Tag and description are valid.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(await communityAuthorization.isCommunityModerator(
        // eslint-disable-next-line no-underscore-dangle
        user._id,
        community.title,
        communityAuthorization.roles.moderator
      ))
    )
      throw new ResponseError(
        403,
        "Only moderator of community can edit community."
      );
    req.log.addAction("User is moderator of community.");

    req.log.addAction("Checking if community tag is already set.");
    if (
      await Community.exists({
        title: community.title,
        "tags.tag": req.query.tag,
      })
    )
      throw new ResponseError(403, "No duplicate tags.");

    req.log.addAction("Checking community tags limit.");
    if (
      await Community.exists({
        title: community.title,
        tags: { $size: 7 },
      })
    )
      throw new ResponseError(403, "A community can't have more than 7 tags.");

    // Add to community
    req.log.addAction("Updating community tags.");
    await Community.updateOne(
      { title: community.title },
      {
        $push: {
          tags: {
            tag: req.body.tag,
            description: req.body.description,
            count: 0,
          },
        },
      }
    );
    req.log.addAction("Community tags updated.");

    // Add to availableTags array on posts
    req.log.addAction("Updating availableTags on posts in community.");
    await Post.updateMany(
      { community: community.title },
      { $push: { availableTags: req.query.tag } }
    );
    req.log.addAction("Community posts updated.");

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
 *  /api/community/tags/{title}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Tags
 *      summary: Remove community tag by community title.
 *      parameters:
 *        - in: path
 *          required: true
 *          name: title
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/title'
 *        - in: query
 *          required: true
 *          name: tag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/tags/items/properties/tag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Tag not found in query.
 *        '403':
 *          description: Only moderator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove community tag by community title
router.delete("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking tag query.");
    if (!req.query.tag || req.query.tag === "")
      throw new ResponseError(404, "Tag not found in query.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(await communityAuthorization.isCommunityModerator(
        // eslint-disable-next-line no-underscore-dangle
        user._id,
        community.title,
        communityAuthorization.roles.moderator
      ))
    )
      throw new ResponseError(
        403,
        "Only moderator of community can edit community."
      );
    req.log.addAction("User is moderator of community.");

    // Remove tag from community
    req.log.addAction("Updating community tags.");
    await Community.updateOne(
      { title: community.title },
      { $pull: { tags: { tag: req.query.tag } } }
    );
    req.log.addAction("Community tags updated.");

    // Remove tag from posts within community
    req.log.addAction("Removing tag from posts in community.");
    await Post.updateMany(
      { community: community.title },
      { $pull: { tags: { tag: req.query.tag }, availableTags: req.query.tag } }
    );
    req.log.addAction("Tag on posts in community removed.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
