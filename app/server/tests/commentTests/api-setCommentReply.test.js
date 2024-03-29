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

const newComTitle = `set comment replies - ${userName}`;
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
const newComment2 = "this guy must be such a good developer";
const newComment3 = "I with I was as smart as this guy";

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
      token,
      newComRules,
      newComTags
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
  test("API returns a successful response - code 201", async () => {
    commentResponse = await comment.createComment(
      newComment,
      postResponse.body._id,
      token
    );
    expect(commentResponse.status).toBe(201);
  });
});

describe("Create Comment Reply - on the created comment", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await comment.setCommentReply(
      commentResponse.body._id,
      newComment2,
      token
    );
    expect(response.status).toBe(201);
  });
});

describe("Get Comment Reply - on the created comment", () => {
  test("API returns the comment reply", async () => {
    const response = await comment.getCommentReply(
      commentResponse.body._id,
      token
    );
    expect(response.text).toContain(newComment2);
  });
});

describe("Create 2nd Comment Reply - on the created comment", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await comment.setCommentReply(
      commentResponse.body._id,
      newComment3,
      token
    );
    expect(response.status).toBe(201);
  });
});

describe("Get Comment Reply - on the created comment", () => {
  test("API returns both comment replies", async () => {
    const response = await comment.getCommentReply(
      commentResponse.body._id,
      token
    );
    expect(response.text).toContain(newComment2);
    expect(response.text).toContain(newComment3);
  });
});

describe("Deleting new Community", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
