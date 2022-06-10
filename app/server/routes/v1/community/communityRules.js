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

/**
 * @swagger
 * paths:
 *  /api/community/rules/{title}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Rules
 *      summary: Set community rules by title.
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
 *                rules:
 *                  $ref: '#/components/schemas/Community/properties/rules'
 *      responses:
 *        '404':
 *          description: User not found. **||** <br>Community not found.
 *        '403':
 *          description: Only creator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Set community rules by title
router.put("/:title", async (req, res) => {
  req.log.setRequestBody(req.body, false);
  try {
    const documents = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });

    if (documents.user.username !== documents.community.creator)
      throw new ResponseError(
        403,
        "Only creator of community can edit community."
      );

    await Community.updateOne(
      { title: documents.community.title },
      { $set: { rules: req.body.rules } }
    ).exec();

    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

/**
 * @swagger
 * paths:
 *  /api/community/rules/{title}:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Rules
 *      summary: Get community rules by title.
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
 *                $ref: '#/components/schemas/Community/properties/rules'
 *        '400':
 *          description: Bad Request.
 */

// Get community rules by title
router.get("/:title", async (req, res) => {
  try {
    const documents = await findSingleDocuments({
      community: req.params.title,
    });

    return res.status(200).json(documents.community.rules);
  } catch (err) {
    if (err instanceof ResponseError)
      return res.status(err.status).send(err.message);
    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
