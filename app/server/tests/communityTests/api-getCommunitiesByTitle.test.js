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
const welComDescript = "The Neighbourhood";

const newComTitle = `get Communities by Title - ${userName}`;
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

describe('Get Community by Title - With Login, testing with "Welcome" community', () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(welComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community description and title in its response body', () => {
    expect(`${response.text}`).toContain(welComDescript);
    expect(`${response.text}`).toContain(welComTitle);
  });
});

describe("Get Community by Title - With Login, testing with null", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(null, token);
  });

  test("API returns a unsuccessful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Community not found.");
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

describe("Get Community by Title - With Login, testing with new Community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(newComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test("API returns description -  includes new community Title", () => {
    expect(`${response.text}`).toContain(newComTitle);
  });
});

describe("Deleting new Community - (1)", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Get Community by Title - With Login, testing with new Community after the deletion", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(newComTitle, token);
  });

  afterAll(async () => {
    response = await community.deleteCommunity(newComTitle, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Community has been removed.");
  });
});

describe('Creating new Community with " " as title', () => {
  test("API returns a unsuccessful response - code 403", async () => {
    const response = await community.createCommunity(
      " ",
      newComDescript,
      token,
      newComRules,
      newComTags
    );
    expect(response.status).toBe(403);
  });
});

describe('Get Community by Title - With Login, testing with new " " Community', () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunitybyTitle(" ", token);
  });

  test("API returns a successful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test("API returns description -  includes new community Title", () => {
    expect(`${response.text}`).toContain(" ");
  });
});

if (process.env.RUN_BREAKING_TESTS === "true") {
  describe("Deleting new Community - (2)", () => {
    test("API returns a unsuccessful response - code 404", async () => {
      const response = await community.deleteCommunity(" ", token);
      expect(response.status).toBe(404);
    });
  });
}

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
