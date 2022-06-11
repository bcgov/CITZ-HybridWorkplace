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
const User = require("../../../models/user.model");

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
router.get("/:title", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    if (req.query.count === "true")
      return res
        .status(200)
        .json({ count: documents.community.members.length || 0 });

    req.log.setResponse(204, "Success", null);
    return res.status(200).json(documents.community.members);
  } catch (err) {
    // Excplicitly thrown error
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
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Join community by title
router.patch("/join/:title", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    await Community.updateOne(
      { title: documents.community.title },
      { $addToSet: { members: documents.user.id } }
    );

    await User.updateOne(
      { username: documents.user.username },
      {
        $addToSet: {
          communities: { community: documents.community.title, engagement: 0 },
        },
      }
    );

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Excplicitly thrown error
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
router.delete("/leave/:title", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    // Remove user from community
    await Community.updateOne(
      { title: documents.community.title },
      { $pull: { members: documents.user.id } }
    );

    // Remove community from user's communities array
    await User.updateOne(
      { username: documents.user.username },
      {
        $pull: {
          communities: { community: documents.community.title },
        },
      }
    );

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    // Excplicitly thrown error
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
