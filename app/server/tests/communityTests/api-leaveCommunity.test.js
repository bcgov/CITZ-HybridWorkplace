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

const newComTitle = `Leave Communities - ${userName}`;
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

describe("Leave Community by Title - With Login, community does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test("API returns a unsuccessful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect(`${response.text}`).toContain("Community not found.");
  });
});

describe("Creating new Community", () => {
  test("API returns a successful response - code 201", async () => {
    response = await community.deleteCommunity(newComTitle, token);
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

describe("Leave Community by Title - With Login, community exists", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });
});

describe("Leave Community by Title - With Login, but already left", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe('Get Community Members - With Login, testing with "new" community', () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityMembers(newComTitle, true, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });
});

describe("Deleting new Community", () => {
  test("API returns a successful response - code 204", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Leave Community by Title - With Login, but community does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community not found."', () => {
    expect(`${response.text}`).toContain("Community has been removed.");
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
