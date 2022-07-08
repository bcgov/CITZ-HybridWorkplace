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

const newComTitle = "delete Community Tags";
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

const updatedTags = "new";

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

describe("Get Communities Tags - After Login with welcome community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.getCommunityTags(welComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community tags', () => {
    expect(` ${response.text} `).toContain("[]");
  });
});

describe("Creating new Community", () => {
  test("API returns a successful response - code 201", async () => {
    await community.deleteCommunity(newComTitle, token);
    const response = await community.createCommunity(
      newComTitle,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
    expect(response.status).toBe(201);
  });
});

describe("Set Communities tag to updatedTags", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await community.setCommunityTags(
      newComTitle,
      updatedTags,
      token
    );
    expect(response.status).toBe(204);
  });
});

describe("Get Communities tags", () => {
  test("API returns the updated tag", async () => {
    response = await community.getCommunityTags(newComTitle, token);
    expect(` ${response.text} `).toContain(updatedTags);
  });
});

describe("Delete Communities tags - After Login on new community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunityTags(
      newComTitle,
      updatedTags,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });

  test('API returns resonse - "Tag removed."', () => {
    expect(` ${response.text} `).toContain("Tag removed.");
  });
});

describe("Get Communities Tags after tag deletion", () => {
  test("API returns the updated tag", async () => {
    response = await community.getCommunityTags(newComTitle, token);
    expect(` ${response.text} `).not.toContain(updatedTags);
  });
});

describe("Delete Communities tags - After Login on new community, tag does not exist", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.deleteCommunityTags(
      newComTitle,
      updatedTags,
      token
    );
  });

  test("API returns a successful response - code 404", () => {
    expect(response.status).toBe(404);
  });

  test('API returns resonse - "Tag not found."', () => {
    expect(` ${response.text} `).toContain("Tag not found.");
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
