/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const { CommunityFunctions } = require("../functions/communityFunctions");
const { AuthFunctions } = require("../functions/authFunctions");
const { CommentFunctions } = require("../functions/commentFunctions");
const { PostFunctions } = require("../functions/postFunctions");
const user = require("../functions/userFunctions");
const { name, email } = require("../functions/randomizer");

const userName = name.gen();
const userPassword = "Tester123!";
const userEmail = email.gen();
const community = new CommunityFunctions();
const auth = new AuthFunctions();
const comment = new CommentFunctions();
const post = new PostFunctions();
let token = "";

let commentResponse;
let postResponse;

const newComTitle = "hello get Titles";
const newComDescript = "world";
const newComRules = [
  {
    rule: "Be nice",
    description: "be the best person you can be!",
  },
];
const newComTags = [
  {
    tag: "Informative",
  },
];

const newPostTitle = "my first post!";
const newPostDescript = "for testing comments";

const newComment = "this is so deep";

describe("Registering a test user", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await auth.register(userName, userEmail, userPassword);
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});

describe("Logging in the test user", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await auth.login(userName, userPassword);
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});

describe("Creating new Community", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await community.createCommunity(
      newComTitle,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
    expect(response.status).toBe(201);
  });
});

describe("Creating new Post", () => {
  test("API returns a successful response - code 201", async () => {
    postResponse = await post.createPost(
      newPostTitle,
      newPostDescript,
      newComTitle,
      token
    );
    expect(postResponse.status).toBe(201);
  });
});

describe("Create Comment - on the created post", () => {
  beforeAll(async () => {
    commentResponse = await comment.createComment(
      newComment,
      postResponse.body._id,
      token
    );
  });

  test("API returns a successful response - code 201", () => {
    expect(commentResponse.status).toBe(201);
  });

  test("API returns description -  includes new comment", () => {
    expect(`${commentResponse.text}`).toContain(newComment);
  });
});

describe("Vote on comment - upvote", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await comment.setCommentVote(
      commentResponse.body._id,
      "up",
      token
    );
    expect(`${response.status}`).toContain(204);
  });
});

describe("Get comment votes - on the created comment", () => {
  test("API returns description -  includes an upvote of 1", async () => {
    const response = await comment.getCommentsByPost(
      postResponse.body._id,
      token
    );
    expect(`${response.text}`).toContain("upvote101");
  });
});

describe("Vote on comment - downvote", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await comment.setCommentVote(
      commentResponse.body._id,
      "up",
      token
    );
    expect(`${response.status}`).toContain(204);
  });
});

describe("Get comment votes - on the created comment", () => {
  test("API returns description -  includes an downvote of 1", async () => {
    const response = await comment.getCommentsByPost(
      postResponse.body._id,
      token
    );
    expect(`${response.text}`).toContain("upvote101");
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
