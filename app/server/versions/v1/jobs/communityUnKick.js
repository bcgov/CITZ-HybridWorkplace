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

const Community = require("../models/community.model");

/**
 * @description Defines the job that removes user's from the kicked array on Community.
 * @param agenda Job scheduler, defined in connection.js
 */
const communityUnKick = async (agenda, community, userId, username) => {
  agenda.define(`communityUnKick-${userId}`, async () => {
    await Community.updateOne(
      { title: community },
      {
        $pull: {
          kicked: {
            userId,
          },
        },
      }
    );
    console.log(
      `Agenda removed ${username} from kicked array of ${community}.`
    );
  });
};

module.exports = communityUnKick;
