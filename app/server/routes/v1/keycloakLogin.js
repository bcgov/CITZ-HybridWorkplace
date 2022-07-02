const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // hashing passwords
const moment = require("moment");

const ResponseError = require("../../responseError");
const generateRefreshToken = require("../../functions/generateRefreshToken");
const User = require("../../models/user.model");
const Community = require("../../models/community.model");
const memoryStore = require("../../express");

const router = express.Router();

const frontendURI = process.env.REACT_APP_LOCAL_DEV
  ? `http://${process.env.FRONTEND_REF}:${process.env.FRONTEND_PORT}`
  : process.env.FRONTEND_REF;

router.get("/", async (req, res, next) => {
  try {
    req.log.addAction("Decoding Keycloak JWT Token.");
    const decoded = jwt.decode(req.kauth.grant.access_token.token);

    req.log.addAction("Finding user.");
    let user = await User.findOne({
      username: decoded.idir_username,
    });

    if (!user) {
      req.log.addAction("No user object, creating user.");
      user = await User.create({
        username: decoded.idir_username,
        email: decoded.email,
        registeredOn: moment().format("MMMM Do YYYY, h:mm:ss a"),
        postCount: 0,
        notificationFrequency: "none",
      });
      req.log.addAction("Adding user to Welcome community.");
      await Community.updateOne(
        { title: "Welcome" },
        {
          $push: {
            members: user.id,
          },
          $inc: { memberCount: 1 },
        }
      );
      req.log.addAction("Adding Welcome community to user.");
      await User.updateOne(
        { username: req.body.username },
        {
          $push: {
            communities: { community: "Welcome", engagement: 0 },
          },
        }
      );
      req.log.addAction("User is created.");
    }
    req.log.addAction("Generating refresh token.");
    const refreshToken = generateRefreshToken(user);

    req.log.addAction("Hashing refresh token.");
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    req.log.addAction("Added refresh token to user.");
    await User.updateOne(
      { username: user.username },
      { refreshToken: hashedRefreshToken }
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.redirect(frontendURI);
  } catch (err) {
    // Explicitly thrown error
    if (err instanceof ResponseError) {
      return res.status(err.status).send(err.message);
    }
    // Bad Request

    return res.status(400).send(`Bad Request: ${err}`);
  }
});

module.exports = router;
