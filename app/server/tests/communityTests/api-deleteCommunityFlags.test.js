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

const newComTitle = "delete Community Flags";
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

describe("Set up Communities Flags  - create valid flag", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await community.setCommunityFlags(
      newComTitle,
      updatedFlag,
      token
    );
    expect(response.status).toBe(204);
  });

  test("API returns the new flag", async () => {
    const response = await community.getCommunityFlags(newComTitle, token);
    expect(` ${response.text} `).toContain(updatedFlag);
  });
});

describe("Delete Communities Flags  - delete valid flag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunityFlags(
      newComTitle,
      updatedFlag,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });

  test('API returns a unsuccessful response message - "Success"', () => {
    expect(` ${response.text} `).toContain("Success");
  });
});

describe("Delete Communities Flags  - flag does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunityFlags(
      newComTitle,
      updatedFlag,
      token
    );
  });

  test("API returns a successful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns a unsuccessful response message - "User has not flagged community with new Flag."', () => {
    expect(` ${response.text} `).toContain(
      `User has not flagged community with ${updatedFlag}`
    );
  });
});

describe("Delete Communities Flags  - no flag given in query", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunityFlags(newComTitle, "", token);
  });

  test("API returns a successful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns a unsuccessful response message - "Flag not found in query."', () => {
    expect(` ${response.text} `).toContain("Flag not found in query.");
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
