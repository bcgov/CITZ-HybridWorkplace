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

const router = express.Router();

const User = require("../models/user.model");

// Get user's profile
router.get("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      name: user.name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the body of the Request is either missing or malformed. ${err}`
      );
  }
});

// Edit user's profile
router.patch("/", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.user.name });

    if (!user) return res.status(404).send("User not found.");

    await User.updateOne(
      { name: user.name },
      {
        $set: {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          title: req.body.title,
          bio: req.body.bio,
          quote: req.body.quote,
        },
      }
    );

    return res.sendStatus(204);
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the params of the Request is either missing or malformed. ${err}`
      );
  }
});

// Get user profile from name
router.get("/:name", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.params.name }).exec();

    if (!user) return res.status(404).send("User not found.");

    return res.status(200).json({
      name: user.name,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio: user.bio,
      title: user.title,
      quote: user.quote,
    });
  } catch (err) {
    return res
      .status(400)
      .send(
        `Bad Request. The User in the params of the Request is either missing or malformed. ${err}`
      );
  }
});

module.exports = router;
