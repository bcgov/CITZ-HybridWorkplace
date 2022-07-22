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
const {
  communityAuthorization,
} = require("../../functions/auth/communityAuthorization");

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
 *          description: Only moderator of community can edit community.
 *        '204':
 *          description: Success. No content to return.
 *        '400':
 *          description: Bad Request.
 */

// Set community rules by title
router.put("/:title", async (req, res, next) => {
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

    req.log.addAction("Finding options.");
    const {
      ruleMinLength,
      ruleMaxLength,
      ruleDescriptionMinLength,
      ruleDescriptionMaxLength,
    } = await getOptions("community");
    req.log.addAction("Options found.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(
        (await communityAuthorization.isCommunityModerator(
          user.username,
          community.title
        )) || user.role === "admin"
      )
    )
      throw new ResponseError(
        403,
        "Only moderator of community can edit community."
      );
    req.log.addAction("User is moderator of community.");

    // Validate rules
    req.log.addAction("Validating rules.");
    if (req.body.rules && req.body.rules instanceof Object) {
      Object.keys(req.body.rules).forEach((ruleObject) => {
        // Trim extra spaces
        req.body.rules[ruleObject].rule = trimExtraSpaces(
          req.body.rules[ruleObject].rule
        );
        req.body.rules[ruleObject].description = trimExtraSpaces(
          req.body.rules[ruleObject].description
        );

        // Validate rule length
        if (
          req.body.rules[ruleObject].rule.length < ruleMinLength ||
          req.body.rules[ruleObject].rule.length > ruleMaxLength
        )
          throw new ResponseError(
            403,
            `Rules (${req.body.rules[ruleObject].rule}) must have a length of ${ruleMinLength}-${ruleMaxLength}`
          );

        // Validate rule description length
        if (
          req.body.rules[ruleObject].description &&
          (req.body.rules[ruleObject].description.length <
            ruleDescriptionMinLength ||
            req.body.rules[ruleObject].description.length >
              ruleDescriptionMaxLength)
        )
          throw new ResponseError(
            403,
            `Rules (${req.body.rules[ruleObject].rule}) description must have a length of ${ruleDescriptionMinLength}-${ruleDescriptionMaxLength}`
          );
      });
    }
    req.log.addAction("Rules are valid.");

    req.log.addAction("Updating community rules.");
    await Community.updateOne(
      { title: community.title },
      { $set: { rules: req.body.rules } }
    ).exec();
    req.log.addAction("Community rules updated.");

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

    req.log.setResponse(200, "Success");
    return res.status(200).json(community.rules);
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
