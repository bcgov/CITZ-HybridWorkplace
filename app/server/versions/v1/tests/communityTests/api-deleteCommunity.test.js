/* eslint-disable no-undef */
const { CommunityFunctions } = require("../functions/communityFunctions");
const { AuthFunctions } = require("../functions/authFunctions");

const community = new CommunityFunctions();
const auth = new AuthFunctions();

const user = require("../functions/userFunctions");
const { name, email } = require("../functions/randomizer");

let token = "";

const userName = name.gen();
const userPassword = "Tester123!";
const userEmail = email.gen();

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [
  {
    tag: "Informative",
    count: 1,
  },
];

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

describe("Delete Communities - After Login", () => {
  let response = "";

  beforeAll(async () => {
    await community.createCommunity(
      newComTitle,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
    response = await community.deleteCommunity(newComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - "Community removed."', () => {
    expect(response.text).toBe("Community removed.");
  });
});

describe("Get Community by Title - With Login, testing with new Community after the deletion", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(newComTitle, token);
  });

  test("API returns a unsuccessful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns description -  "Community not found."', () => {
    expect(response.text).toBe("Community not found.");
  });
});

describe("Delete Communities - After Login, community does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunity(newComTitle, token);
  });

  test("API returns a successful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect(response.text).toBe("Community not found.");
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
