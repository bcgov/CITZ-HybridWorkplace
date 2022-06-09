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
