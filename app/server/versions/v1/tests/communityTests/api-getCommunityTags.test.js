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

const welComTitle = "Welcome";

const newComTitle = "get Community Tags";
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

describe("Get Communities Tags  - After Login", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityTags(welComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" tags in its response body', () => {
    expect(` ${response.text} `).toContain("[]");
  });
});

describe("Creating new Community", () => {
  test("API returns a successful response - code 201", async () => {
    await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(
      newComTitle,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
    expect(response.status).toBe(201);
  });
});

describe("Get Community Tags - After Login on new community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityTags(newComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test("API returns the new community tags its response body", () => {
    expect(` ${response.text} `).toContain(`${newComTags}`);
  });
});

describe("Deleting new Community", () => {
  test("API returns a successful response - code 204", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
