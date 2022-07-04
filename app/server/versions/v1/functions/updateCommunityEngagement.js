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

const User = require("../models/user.model");

/**
 * @description Updates a user's engagement value for a given community.
 * The engagement value is based on creating the community, posts, and comments.
 * @param {*} username Who's engagement value to update.
 * @param {*} community Which community to update the engagement value for.
 * @param {*} value How much to increase or decrease the engagement value.
 */
const updateCommunityEngagement = async (username, community, value) => {
  await User.updateOne(
    {
      username,
      communities: { $elemMatch: { community } },
    },
    {
      $inc: {
        "communities.$.engagement": value,
      },
    }
  );
};

module.exports = updateCommunityEngagement;
