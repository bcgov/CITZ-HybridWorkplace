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
 * @author [Jayna Bettesworth](bettesworthjayna@gmail.com)
 * @module
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          example: sarah
 *        email:
 *          type: string
 *          example: sarah@gov.bc.ca
 *        password:
 *          type: string
 *          writeOnly: true
 *        first_name:
 *          type: string
 *          example: Sarah
 *        last_name:
 *          type: string
 *          example: Grace
 *        title:
 *          type: string
 *          example: Jr. Software Engineer
 *        bio:
 *          type: string
 *          example: Hi I'm new! Just moved from the Ottawa
 *        communities:
 *          type: array
 *      required:
 *        - name
 *        - email
 *        - password
 */

const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refresh_token: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    title: { type: String },
    bio: { type: String },
    communities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Communities",
      },
    ],
  },
  { collection: "user" }
);

const model = mongoose.model("User", User);

module.exports = model;
