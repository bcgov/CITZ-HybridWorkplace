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

const ResponseError = require("../classes/responseError");
const User = require("../models/user.model");

// Throws error if user is not a member of community.
const checkUserIsMemberOfCommunity = async (user, community) => {
  if (
    !(
      (await User.findOne({
        username: user.username,
        "communities.community": community,
      })) || user.role === "admin"
    )
  )
    throw new ResponseError(
      403,
      `User must be a part of community: ${community}.`
    );
};

module.exports = checkUserIsMemberOfCommunity;
