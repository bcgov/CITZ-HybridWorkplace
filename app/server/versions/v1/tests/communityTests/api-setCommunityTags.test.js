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

const newComTitle = "Set Community Tags";
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

const specialTag = "$@#*()#@*()$()&&&*@$@&";
const linkTag =
  "https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api";
const arrayTag = ["Matt"];
const arrayTag2 = ["Welcome", "to", "the"];
const intTag = 1231;
const jsonTag = JSON.stringify({
  colors: [
    {
      color: "black",
      category: "hue",
      type: "primary",
      code: {
        rgba: [255, 255, 255, 1],
        hex: "#000",
      },
    },
    {
      color: "white",
      category: "value",
      code: {
        rgba: [0, 0, 0, 1],
        hex: "#FFF",
      },
    },
  ],
});

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

describe("Set Communities tags - After Login on new community", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(
      newComTitle,
      updatedTags,
      token
    );
  });

  test("API returns a successful response - code 204", () => {
    expect(response.status).toBe(204);
  });
});

describe("Get Communities Tags - After Login with new community (2)", () => {
  test("API returns the updated tag", async () => {
    response = await community.getCommunityTags(newComTitle, token);
    expect(` ${response.text} `).toContain(updatedTags);
  });
});

describe("Set Communities tags - on new community, with link tag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, linkTag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe("Set Communities tags - on new community, with array tag (1 element)", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, arrayTag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe("Set Communities tags - on new community, with array tag (3 elements)", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, arrayTag2, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe("Set Communities tags - on new community, with int tag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, intTag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe("Set Communities tags - on new community, with json tag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, jsonTag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });
});

describe("Set Communities tags - on new community, with special characters tag", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.setCommunityTags(newComTitle, specialTag, token);
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
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
