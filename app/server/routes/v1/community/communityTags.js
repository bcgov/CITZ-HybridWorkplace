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
const ResponseError = require("../../../responseError");
const findSingleDocuments = require("../../../functions/findSingleDocuments");

const router = express.Router();

const Community = require("../../../models/community.model");
const Post = require("../../../models/post.model");

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
router.get("/:title", async (req, res) => {
  try {
    req.log.addAction("Finding community.");
    const documents = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    req.log.setResponse(200, "Success", null);
    return res.status(200).json(documents.community.tags);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
 *        - in: query
 *          required: true
 *          name: tag
 *          schema:
 *            $ref: '#/components/schemas/Community/properties/tags/items/properties/tag'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found. **||** <br>Tag not found in query.
 *        '403':
 *          description: A community can't have more than 7 tags. **||** <br>No duplicate tags. **||** <br>Only creator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Create community tag by community title
router.post("/:title", async (req, res) => {
  try {
    req.log.addAction("Finding user and community.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking tag query.");
    if (!req.query.tag || req.query.tag === "")
      throw new ResponseError(404, "Tag not found in query.");

    req.log.addAction("Checking user is creator of community.");
    if (documents.user.username !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );
    req.log.addAction("User is creator of community.");

    req.log.addAction("Checking if community tag is already set.");
    if (
      await Community.exists({
        title: documents.community.title,
        "tags.tag": req.query.tag,
      })
    )
      throw new ResponseError(403, "No duplicate tags.");

    req.log.addAction("Checking community tags limit.");
    if (
      await Community.exists({
        title: documents.community.title,
        tags: { $size: 7 },
      })
    )
      throw new ResponseError(403, "A community can't have more than 7 tags.");

    // Add to community
    req.log.addAction("Updating community tags.");
    await Community.updateOne(
      { title: documents.community.title },
      { $push: { tags: { tag: req.query.tag, count: 0 } } }
    );
    req.log.addAction("Community tags updated.");

    // Add to availableTags array on posts
    req.log.addAction("Updating availableTags on posts in community.");
    await Post.updateMany(
      { community: documents.community.title },
      { $push: { availableTags: req.query.tag } }
    );
    req.log.addAction("Community posts updated.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
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
 *          description: Only creator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Remove community tag by community title
router.delete("/:title", async (req, res) => {
  try {
    req.log.addAction("Finding user and community.");
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking tag query.");
    if (!req.query.tag || req.query.tag === "")
      throw new ResponseError(404, "Tag not found in query.");

    req.log.addAction("Checking user is creator of community.");
    if (documents.user.username !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );
    req.log.addAction("User is creator of community.");

    // Remove tag from community
    req.log.addAction("Updating community tags.");
    await Community.updateOne(
      { title: documents.community.title },
      { $pull: { tags: { tag: req.query.tag } } }
    );
    req.log.addAction("Community tags updated.");

    // Remove tag from posts within community
    req.log.addAction("Removing tag from posts in community.");
    await Post.updateMany(
      { community: documents.community.title },
      { $pull: { tags: { tag: req.query.tag }, availableTags: req.query.tag } }
    );
    req.log.addAction("Tag on posts in community removed.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      req.log.setResponse(err.status, "ResponseError", err.message);
      return res.status(err.status).send(err.message);
    }
    // Bad Request
    req.log.setResponse(400, "Error", err);
    return res.status(400).send(`Bad Request: ${err}`);
  } finally {
    req.log.print();
  }
});

module.exports = router;
