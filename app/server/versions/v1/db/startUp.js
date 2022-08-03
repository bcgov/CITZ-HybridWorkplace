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

const moment = require("moment");
const color = require("ansi-colors");

const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Options = require("../models/options.model");

const optionsCollection = require("./init/optionsCollection");

/**
 * @description Operations to do on database startup.
 * @param db Database connection.
 * @param collections Currently created collections.
 */
const mongoStartUp = async (db, collections) => {
  // OPTIONS COLLECTION
  if (!collections.includes("options")) {
    // Creating options collection
    db.createCollection("options");
    console.log(color.yellow("Options collection created."));
  } else {
    // Refresh options collection
    await Options.deleteMany();
    console.log(color.yellow("Options collection cleared."));
  }
  if ((await Options.count()) === 0) {
    // Options collection is empty
    await Options.insertMany(optionsCollection);
    console.log(color.yellow("Options collection initialized."));
  }

  // Create WELCOME COMMUNITY if it doesn't already exist
  const timeStamp = moment().format("MMMM Do YYYY, h:mm:ss a");
  if (collections.includes("community")) {
    if (!(await Community.exists({ title: "Welcome" }))) {
      // Create Welcome community
      await Community.create({
        title: "Welcome",
        description: "Welcome to The Neighbourhood",
        creator: " ",
        createdOn: timeStamp,
        latestActivity: timeStamp,
        members: [],
        removed: false,
      });
      console.log(color.yellow("Welcome community created."));
    }
  }

  if (collections.includes("user")) {
    // Set offline status
    await User.updateMany({ online: true }, { online: false });
  }

  // REMOVE ME
  const brady = await User.find({
    email: { $regex: "brady.Mitchell@gov.bc.ca", $options: "i" },
  });
  const robert = await User.find({
    email: { $regex: "Robert.W.Kobenter@gov.bc.ca", $options: "i" },
  });
  const zach = await User.find({
    email: { $regex: "zach.bourque@gov.bc.ca", $options: "i" },
  });
  const dylan = await User.find({
    email: { $regex: "dylan.barkowsky@gov.bc.ca", $options: "i" },
  });

  await User.updateOne(
    { username: brady[0].username },
    { $set: { role: "admin" } }
  );
  await User.updateOne(
    { username: robert[0].username },
    { $set: { role: "admin" } }
  );
  await User.updateOne(
    { username: zach[0].username },
    { $set: { role: "admin" } }
  );
  await User.updateOne(
    { username: dylan[0].username },
    { $set: { role: "admin" } }
  );

  await Community.updateOne(
    { title: "Welcome" },
    {
      $set: {
        postCount: 0,
        moderators: [
          {
            userId: brady[0].id,
            name: "Brady Mitchell",
            username: brady[0].username,
            permissions: ["set_permissions", "set_moderators"],
          },
          {
            userId: robert[0].id,
            name: "Robert Kobenter",
            username: robert[0].username,
            permissions: ["set_permissions", "set_moderators"],
          },
          {
            userId: zach[0].id,
            name: "Zach Bourque",
            username: zach[0].username,
            permissions: ["set_permissions", "set_moderators"],
          },
          {
            userId: dylan[0].id,
            name: "Dylan Barkowsky",
            username: dylan[0].username,
            permissions: ["set_permissions", "set_moderators"],
          },
        ],
      },
    }
  );

  await User.updateMany({}, { postCount: 0 });
};

module.exports = mongoStartUp;
