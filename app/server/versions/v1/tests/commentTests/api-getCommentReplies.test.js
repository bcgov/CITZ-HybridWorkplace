/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const { CommunityFunctions } = require("../functions/communityFunctions");
const { AuthFunctions } = require("../functions/authFunctions");
const { CommentFunctions } = require("../functions/commentFunctions");
const { PostFunctions } = require("../functions/postFunctions");

const community = new CommunityFunctions();
const user = new AuthFunctions();
const comment = new CommentFunctions();
const post = new PostFunctions();
let token = "";

let commentResponse;
let postResponse;

const newComTitle = "hello get Titles";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [
  {
    tag: "Informative",
    count: 1,
  },
];

const newPostTitle = "my first post!";
const newPostDescript = "for testing comments";

const newComment = "this is so deep";