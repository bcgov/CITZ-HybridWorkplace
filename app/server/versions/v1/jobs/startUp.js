/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
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
const newCommunitiesDigestDaily = require("./newCommunitiesDigestDaily");
const Community = require("../models/community.model");

const rescheduleUnkicks = async (agenda) => {
  try {
    const currDate = moment();

    const usersKicked = await Community.aggregate([
      { $match: { "kicked.period": { $ne: "forever" } } },
      { $unwind: "$kicked" },
      {
        $project: {
          _id: 0,
          community: "$title",
          userId: "$kicked.userId",
          periodEnd: "$kicked.periodEnd",
        },
      },
    ]);

    for (const user in usersKicked) {
      const periodEnd = moment(
        moment(usersKicked[user].periodEnd, "MMMM Do YYYY, h:mm:ss a").toDate()
      );
      const hours = periodEnd.diff(currDate, "hours");

      if (hours > 0) {
        // Reschedule unkick
        await agenda.schedule(
          `in ${hours} hours`,
          `communityUnKick-${usersKicked[user].community}-${usersKicked[user].userId}`
        );
      } else {
        // Unkick
        await Community.updateOne(
          { title: usersKicked[user].community },
          {
            $pull: {
              kicked: { userId: usersKicked[user].userId },
            },
          }
        );
        await agenda.cancel(
          `communityUnKick-${usersKicked[user].community}-${usersKicked[user].userId}`
        );
      }
    }

    if (usersKicked.length > 0)
      console.log(
        color.blueBright(`Agenda rescheduled ${usersKicked.length} unkicks.`)
      );
  } catch (err) {
    console.log(`jobs/startUp: ${err}`);
  }
};

/**
 * @description Defines or calls jobs on database startup.
 * @param agenda Job scheduler, defined in connection.js
 */
const agendaStartUp = (agenda) => {
  // Send out daily New Communities digest every day at 11:00am UTC (4:00am PDT)
  newCommunitiesDigestDaily(agenda);
  agenda.every("0 11 * * *", "newCommunities");

  rescheduleUnkicks(agenda);
};

module.exports = agendaStartUp;
