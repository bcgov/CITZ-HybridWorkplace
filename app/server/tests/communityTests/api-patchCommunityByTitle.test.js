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

const newComTitle = "Patch Communites by Titles";
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

const updatedCommunityTitle = "hello new world";

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

describe("Edit Community - With login, change title", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.patchCommunitybyTitle(
      newComTitle,
      updatedCommunityTitle,
      newComDescript,
      newComRules,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});

describe("Get Communities - get altered community title (1)", () => {
  test('API returns the "Welcome" community description and title in its response body', async () => {
    const response = await community.getCommunitybyTitle(
      updatedCommunityTitle,
      token
    );
    expect(response.status).toBe(200);
    expect(` ${response.text} `).toContain(newComDescript);
    expect(` ${response.text} `).toContain(updatedCommunityTitle);
  });
});

describe("Get Communities - get old community title (1)", () => {
  test("Api returns a unsuccessful respone - code 404", async () => {
    const response = await community.getCommunitybyTitle(newComTitle, token);
    expect(response.status).toBe(404);
  });
});

describe("Edit Community - With login, same community back to original title", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.patchCommunitybyTitle(
      updatedCommunityTitle,
      newComTitle,
      newComDescript,
      newComRules,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});

describe("Get Communities - get altered community title (2)", () => {
  test('API returns the "new" community description and title in its response body', async () => {
    const response = await community.getCommunitybyTitle(newComTitle, token);
    expect(response.status).toBe(200);
    expect(` ${response.text} `).toContain(newComDescript);
    expect(` ${response.text} `).toContain(newComTitle);
  });
});

describe("Get Communities - get old community title (2)", () => {
  test("Api returns a unsuccessful respone - code 404", async () => {
    const response = await community.getCommunitybyTitle(
      updatedCommunityTitle,
      token
    );
    expect(response.status).toBe(404);
  });
});

describe("Edit Community - With login and token, change all fields to empty", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.patchCommunitybyTitle(
      newComTitle,
      "",
      "",
      "",
      token
    );
  });

  test("API returns a successful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "description does not meet requirements: length 0-300."', () => {
    expect(response.text).toBe(
      "description does not meet requirements: length 0-300."
    );
  });
});

describe("Edit Community - With login and token, running multiple edits synchronously ", () => {
  let response = "";

  beforeAll(async () => {
    community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}1`,
      newComRules,
      token
    );
    community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}2`,
      newComRules,
      token
    );
    community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}3`,
      newComRules,
      token
    );
    community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}4`,
      newComRules,
      token
    );
    community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}5`,
      newComRules,
      token
    );
    await community.patchCommunitybyTitle(
      newComTitle,
      newComTitle,
      `${newComDescript}6`,
      newComRules,
      token
    );
    response = await community.getCommunitybyTitle(newComTitle, token);
  });

  test("API returns a successful response - code 200", () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - ""', () => {
    expect(response.text).toContain(`${newComDescript}6`);
  });
});

describe("Removing new Community", () => {
  test("API returns a successful response - code 204", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe("Removing old Community", () => {
  test("API returns a unsuccessful response - code 404", async () => {
    response = await community.deleteCommunity(updatedCommunityTitle, token);
    expect(response.status).toBe(404);
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
