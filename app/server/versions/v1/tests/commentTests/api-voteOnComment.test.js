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
const newComRules = "1. rules";
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

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
