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
 * @author [Zach Bourque](zachbourque01@gmail.com)
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

const Community = require("../../models/community.model");

// Returns a boolean reflecting if the user is authorized to edit the inputted community
const isCommunityModerator = async (username, communityTitle, permissions) => {
  let isModWPermissions = false;
  const community = await Community.findOne({
    title: communityTitle,
    "moderators.username": username,
  });
  if (community) isModWPermissions = true;

  // Check permissions
  if (isModWPermissions && permissions && permissions.length > 0) {
    Object.keys(community.moderators).forEach((key) => {
      // Find moderator in array of moderators
      if (community.moderators[key].username === username) {
        // Compare moderators permissions to required permissions
        const arrayContainsAll = (arr, target) =>
          target.every((v) => arr.includes(v));
        const modsPermissions = community.moderators[key].permissions;
        if (!arrayContainsAll(modsPermissions, permissions))
          isModWPermissions = false;
      }
    });
  }

  return isModWPermissions;
};

const authorization = {
  isCommunityModerator,
};

exports.communityAuthorization = authorization;
