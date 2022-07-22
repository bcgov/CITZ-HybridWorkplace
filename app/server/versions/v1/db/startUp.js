/* eslint-disable no-console */
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

    // Add hidden and removed fields to communities that don't have them
    await Community.updateMany({ removed: null }, { removed: false });
    await Community.updateMany({ hidden: null }, { hidden: false });
  }
};

module.exports = mongoStartUp;
