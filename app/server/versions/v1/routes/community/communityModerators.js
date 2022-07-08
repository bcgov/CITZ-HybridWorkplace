const express = require("express");
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

router.patch("/promote/:title", async (req, res, next) => {
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

module.exports = router;
