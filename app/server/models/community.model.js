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
 *          example: Welcome
 *        description:
 *          type: string
 *          example: Welcome to TheNeighbourhood
 *        creator:
 *          type: string
 *        members:
 *          type: array
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
