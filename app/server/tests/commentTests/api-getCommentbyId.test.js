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

let postResponse;
let commentResponse;

const newComTitle = `get Comments by Id - ${userName}`;
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

describe("Get Comment by ID - on the created comment", () => {
  let response = "";

  beforeAll(async () => {
    response = await comment.getCommentsById(commentResponse.body._id, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test("API returns description -  includes new comment", () => {
    expect(`${response.text}`).toContain(newComment);
  });
});

describe("Delete Comment - on the created comment", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await comment.deleteComment(
      commentResponse.body._id,
      token
    );
    expect(response.status).toBe(204);
  });
});

describe("Get Comment by ID - on the created comment, after comment is removed", () => {
  let response = "";

  beforeAll(async () => {
    response = await comment.getCommentsById(commentResponse.body._id, token);
  });

  test("API returns an unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test("API returns description -  includes new comment", () => {
    expect(`${response.text}`).not.toContain(newComment);
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
