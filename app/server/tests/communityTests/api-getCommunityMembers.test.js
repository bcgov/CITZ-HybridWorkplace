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

const newComTitle = `get members - ${userName}`;
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

const welComTitle = "Welcome";

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

describe('Get Community Members - With Login, testing with "Welcome" community', () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityMembers(welComTitle, false, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test("API returns the members list of the community", () => {
    expect(`${response.text}`).toContain(userName);
  });
});

describe("Creating new Community", () => {
  test("API returns a successful response - code 201", async () => {
    response = await community.createCommunity(
      newComTitle,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
    expect(response.status).toBe(201);
  });
});

describe("Get Community Member count - With Login, testing with new Community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityMembers(newComTitle, true, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test("API returns description -  includes new community Title", () => {
    expect(`${response.text}`).toContain("1");
  });
});

describe("Leaving new Community", () => {
  test("API returns a successful response - code 200", async () => {
    response = await community.leaveCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Deleting new Community", () => {
  test("API returns a successful response - code 204", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Get Community Members - With Login, but community does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityMembers(newComTitle, false, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community already exists."', () => {
    expect(`${response.text}`).toContain("Community has been removed.");
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
