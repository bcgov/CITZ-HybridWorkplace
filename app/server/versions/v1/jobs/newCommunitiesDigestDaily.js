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
const User = require("../models/user.model");
const bulkNotify = require("../functions/bulkNotify");

const frontendURI =
  process.env.REACT_APP_LOCAL_DEV === "true"
    ? `http://${process.env.FRONTEND_REF}:${process.env.FRONTEND_PORT}`
    : process.env.FRONTEND_REF;

/**
 * @description Defines the job that sends an email digest through
 * gcNotify to user's who have selected "daily" notifications.
 * @param agenda Job scheduler, defined in connection.js
 */
const newCommunitiesDigestDaily = async (agenda) => {
  agenda.define("newCommunities", async () => {
    // gcNotify toggle
    if (process.env.ENABLE_GC_NOTIFY) {
      /**
       * Set the notifyMatchQuery for finding users to send the email to.
       * gcNotify trialMode requires user's to be in a mailing list, so if
       * trial mode is enabled, check isInMailingList which is set on register.
       */
      const notifyMatchQuery = process.env.ENABLE_GC_NOTIFY_TRIAL_MODE
        ? {
            notificationFrequency: "daily",
            isInMailingList: true,
          }
        : {
            notificationFrequency: "daily",
          };

      const date = moment().subtract(1, "days").format("MMMM Do YYYY");

      // Create an array of users to send to gcNotify
      let notifyUsers = await User.aggregate([
        { $match: notifyMatchQuery },
        {
          $addFields: {
            name: {
              $ifNull: ["$firstName", "$username"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            row: ["$email", "$name", date, frontendURI],
          },
        },
      ]);
      notifyUsers = notifyUsers.map(({ row }) => row);
      notifyUsers.unshift(["email address", "name", "date", "url"]);

      if (notifyUsers.length > 1) {
        // Send the request to gcNotify
        bulkNotify(
          notifyUsers,
          process.env.GC_NOTIFY_NEW_COMMUNITIES_DAILY_TEMPLATE
        );
      }
    }
  });
};

module.exports = newCommunitiesDigestDaily;
