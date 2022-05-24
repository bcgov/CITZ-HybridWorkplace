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
 *    Post:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Used to identify a specific post.
 *        title:
 *          type: string
 *          description: Title of the post.
 *          example: What is DevOps?
 *        message:
 *          type: string
 *          description: Body of the post.
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        community:
 *          $ref: '#/components/schemas/Community/properties/title'
 *      required:
 *        - title
 */

const mongoose = require("mongoose");

const Post = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String },
    creator: { type: String },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
    flagged: { type: Boolean },
  },
  { collection: "post" }
);

const model = mongoose.model("Post", Post);

module.exports = model;
