//
// Copyright © 2022 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/**
 * Application entry point
 * @author [Brady Mitchell](braden.jr.mitch@gmail.com)
 * @module
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Community:
 *      type: object
 *      properties:
 *        title:
 *          type: string
 *          name: title
 *          description: Title of the community.
 *          example: Welcome
 *        description:
 *          type: string
 *          name: description
 *          description: Description of the community.
 *          example: Welcome to TheNeighbourhood
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        members:
 *          type: array
 *          description: Users that have joined the community.
 *          items:
 *            - $ref: '#/components/schemas/User'
 *      required:
 *        - title
 */

const mongoose = require("mongoose");

const Community = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    flagged: { type: Boolean },
  },
  { collection: "community" }
);

const model = mongoose.model("Community", Community);

module.exports = model;
