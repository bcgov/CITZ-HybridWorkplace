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

// Endpoints are grouped by tags in Swagger Docs
const tags = [
  {
    name: "API",
  },
  {
    name: "Auth",
    description: "Login, logout, register, and refresh access token.",
  },
  {
    name: "Community",
    description: "View, create, edit, and delete communities.",
  },
  {
    name: "Community Members",
    description: "Join, leave, view members of communities.",
  },
  {
    name: "Community Rules",
    description: "View and edit community rules.",
  },
  {
    name: "Community Tags",
    description: "View and edit community tags.",
  },
  {
    name: "Community Flags",
    description: "View, set, and unset community flags.",
  },
  {
    name: "Post",
    description: "View, create, edit, and delete posts.",
  },
  {
    name: "Post Tags",
    description: "View, tag, and untag posts.",
  },
  {
    name: "Post Flags",
    description: "View, set, and unset post flags.",
  },
  {
    name: "Comment",
    description: "View, create, edit, and delete comments.",
  },
  {
    name: "Comment Replies",
    description: "View replies and create replies.",
  },
  {
    name: "Comment Voting",
    description: "Upvote and downvote comments.",
  },
  {
    name: "Comment Flags",
    description: "View, set, and unset comment flags.",
  },
  {
    name: "User",
    description: "View and edit user settings.",
  },
];

module.exports = tags;
