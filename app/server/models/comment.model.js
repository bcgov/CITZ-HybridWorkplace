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
 *    Comment:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *          description: Used to identify a specific comment.
 *        message:
 *          type: string
 *          description: Body of the comment.
 *        creator:
 *          $ref: '#/components/schemas/User/properties/id'
 *        post:
 *          $ref: '#/components/schemas/Post/properties/id'
 *      required:
 *        - message
 *        - creator
 *        - post
 */

const mongoose = require("mongoose");

const Comment = new mongoose.Schema(
  {
    message: { type: String, required: true },
    creator: { type: String, required: true },
    post: { type: String, required: true },
  },
  { collection: "comment" }
);

const model = mongoose.model("Comment", Comment);

module.exports = model;
