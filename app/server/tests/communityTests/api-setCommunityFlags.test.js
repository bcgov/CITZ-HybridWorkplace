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

const newComTitle = `set Community Flags - ${userName}`;
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

const updatedFlag = "Inappropriate";
const updatedFlagBad = "weird ;(";
const linkFlag =
  "https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api-docs/#/";

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
    await community.deleteCommunity(newComTitle, token);
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

describe("Set Communities Flags  - After Login", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityFlags(
      newComTitle,
      updatedFlag,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });
});

describe("Get Communities Flags  - After Login", () => {
  test('API returns the "Welcome" tags in its response body', async () => {
    const response = await community.getCommunityFlags(newComTitle, token);
    expect(` ${response.text} `).toContain(updatedFlag);
  });
});

describe("Set Communities Flags  - After Login, bad flag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityFlags(
      newComTitle,
      updatedFlagBad,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns a unsuccessful response message - "Invalid Tag"', () => {
    expect(` ${response.text} `).toContain("Invalid flag");
  });
});

describe("Get Communities Flags  - After Login", () => {
  test('API returns the "Welcome" tags in its response body', async () => {
    const response = await community.getCommunityFlags(newComTitle, token);
    expect(` ${response.text} `).not.toContain(updatedFlagBad);
  });
});

describe("Set Communities Flags  - After Login, bad flag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityFlags(newComTitle, linkFlag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns a unsuccessful response message - "Invalid Tag"', () => {
    expect(` ${response.text} `).toContain("Invalid flag");
  });
});

describe("Get Communities Flags  - After Login", () => {
  test('API returns the "Welcome" tags in its response body', async () => {
    const response = await community.getCommunityFlags(newComTitle, token);
    expect(` ${response.text} `).not.toContain(linkFlag);
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
