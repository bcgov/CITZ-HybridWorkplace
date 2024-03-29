const communityRouter = require("./community/community");
const communityFlagsRouter = require("./community/communityFlags");
const communityTagsRouter = require("./community/communityTags");
const communityRulesRouter = require("./community/communityRules");
const communityMembersRouter = require("./community/communityMembers");
const communityModeratorsRouter = require("./community/communityModerators");

const postRouter = require("./post/post");
const postFlagsRouter = require("./post/postFlags");
const postTagsRouter = require("./post/postTags");

const commentRouter = require("./comment/comment");
const commentReplyRouter = require("./comment/commentReply");
const commentVoteRouter = require("./comment/commentVoting");
const commentFlagsRouter = require("./comment/commentFlags");

const userRouter = require("./user");

const registerRouter = require("./register");
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const healthCheckRouter = require("./healthCheck");
const tokenRouter = require("./token");

const searchRouter = require("./search");
const onlineStatusRouter = require("./onlineStatus");
const adminRouter = require("./admin");

module.exports = {
  communityRouter,
  communityFlagsRouter,
  communityTagsRouter,
  communityRulesRouter,
  communityMembersRouter,
  communityModeratorsRouter,
  postRouter,
  postFlagsRouter,
  postTagsRouter,
  commentRouter,
  commentReplyRouter,
  commentVoteRouter,
  commentFlagsRouter,
  userRouter,
  registerRouter,
  loginRouter,
  logoutRouter,
  healthCheckRouter,
  tokenRouter,
  searchRouter,
  onlineStatusRouter,
  adminRouter,
};
