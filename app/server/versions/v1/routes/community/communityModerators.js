const express = require("express");
const {
  communityAuthorization,
} = require("../../authorization/communityAuthorization");
const ResponseError = require("../../classes/responseError");
const findSingleDocuments = require("../../functions/findSingleDocuments");

const router = express.Router();

const Community = require("../../models/community.model");
const User = require("../../models/user.model");

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
    const { community } = await findSingleDocuments({
      community: req.params.title,
    });
    req.log.addAction("Community found.");

    req.log.addAction("Checking count query.");
    if (req.query.count === "true")
      return res.status(200).json({ count: community.moderators.length || 0 });

    req.log.setResponse(204, "Success", null);
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
 *  /api/community/moderators/{title}:
 *    patch:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - Community Moderators
 *      summary: Set array of community moderators.
 *      description: Updates array of moderators if the user is a moderator.
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
 *          description: Success. No content to return
 *        '403':
 *          description: Only moderator of community can edit community.
 */

router.patch("/:title", async (req, res, next) => {
  try {
    req.log.addAction("Finding user and community.");
    const { user, community } = await findSingleDocuments({
      user: req.user.username,
      community: req.params.title,
    });
    req.log.addAction("User and community found.");

    req.log.addAction("Checking user is moderator of community.");
    if (
      !(await communityAuthorization.isCommunityModerator(
        // eslint-disable-next-line no-underscore-dangle
        user._id,
        community.title
      ))
    )
      throw new ResponseError(
        403,
        "Only moderator of community can edit community."
      );
    req.log.addAction("User is moderator of community.");

    req.log.addAction("Updating community moderators.");
    await Community.updateOne(
      { title: community.title },
      { $set: { moderators: req.body.moderators } }
    );
    req.log.addAction("Community moderators updated.");

    req.log.setResponse(204, "Success", null);
    return res.status(204).send("Success. No content to return.");
  } catch (err) {
    res.locals.err = err;
  } finally {
    next();
  }
});

module.exports = router;
