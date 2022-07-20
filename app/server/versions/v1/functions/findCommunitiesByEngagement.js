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

const { ObjectId } = require("mongodb");
const Community = require("../models/community.model");

/**
 * @param user Which user's engagement to look at.
 * @returns Array of communities ordered by user's engagment (posts, comments, votes).
 */
const findCommunitiesByEngagement = async (user) => {
  const communities = await Community.aggregate([
    { $match: { removed: false } },
    {
      $lookup: {
        from: "user",
        let: { community_title: "$title" },
        pipeline: [
          {
            $unwind: "$communities",
          },
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$communities.community", "$$community_title"] },
                ],
              },
            },
          },
        ],
        as: "userData",
      },
    },
    {
      $addFields: {
        engagement: {
          $ifNull: [{ $sum: ["$userData.communities.engagement"] }, 0],
        },
      },
    },
    {
      $project: {
        userData: 0,
      },
    },
    { $unwind: "$members" },
    {
      $match: {
        members: new ObjectId(user.id),
      },
    },
    { $sort: { engagement: -1, _id: -1 } },
  ]).exec();
  return communities;
};

module.exports = findCommunitiesByEngagement;
