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

const ResponseError = require("../responseError");
const User = require("../models/user.model");
const Community = require("../models/community.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

/**
 * Check if multiple documents exist. If they all exist, return the found documents.
 * If at least one document doesn't exist throw an error.
 */
const findSingleDocuments = async (input) => {
  let user;
  let community;
  let post;
  let comment;

  if (input.user) {
    user = await User.findOne({ username: input.user });
    if (!user) throw new ResponseError(404, "User not found.");
  }

  if (input.community) {
    community = await Community.findOne({ title: input.community });
    if (!community) throw new ResponseError(404, "Community not found.");
  }

  if (input.post) {
    post = await Post.findOne({ _id: input.post });
    if (!post) throw new ResponseError(404, "Post not found.");
  }

  if (input.comment) {
    comment = await Comment.findOne({ _id: input.comment });
    if (!comment) throw new ResponseError(404, "Comment not found.");
  }

  return { user, community, post, comment };
};

module.exports = findSingleDocuments;
