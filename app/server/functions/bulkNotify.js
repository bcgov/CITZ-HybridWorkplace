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

const axios = require("axios").default;
const moment = require("moment");
const ResponseError = require("../responseError");

const bulkNotify = async (users, templateId) => {
  if (!users)
    throw new ResponseError(
      404,
      "No user's we're specified in notify parameter."
    );
  if (process.env.ENABLE_GC_NOTIFY === "true") {
    try {
      await axios({
        method: "post",
        url: "https://api.notification.canada.ca/v2/notifications/bulk",
        headers: {
          Authorization: `ApiKey-v1 ${process.env.GC_NOTIFY_API_KEY_SECRET}`,
          "Content-Type": "application/json",
        },
        data: {
          name: `The Neighbourhood | ${moment().format(
            "MMMM Do YYYY, h:mm a"
          )}`,
          template_id: templateId,
          rows: users,
        },
      });
    } catch (err) {
      console.log(`gcNotify could not complete in notify.js: ${err}`);
    }
  }
};

module.exports = bulkNotify;
