const { CommunityFunctions } = require("../functions/communityFunctions");
const { AuthFunctions } = require("../functions/authFunctions");

const community = new CommunityFunctions();
const user = new AuthFunctions();
let token = "";

const welComTitle = "Welcome";
const welComDescript = "Welcome to theNeighbourhood";
const welComRules = "string";

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [
  {
    tag: "Informative",
  },
];

const htmlComs = "<p> Matts Amazing Community that can not be deleted </p>";
const entityCodeComs = "&#338 &#339 &#352";
const specialCom = "$@#*()#@*()$()&&&*@$@&";
const linkCom =
  "https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api";
const arrayCom = ["Matt"];
const arrayCom2 = ["Welcome", "to", "the"];
const intCom = 1231;
const boolCom = false;
const jsonCom = JSON.stringify({
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

describe("Logging in the test user", () => {
  test("API returns a successful response - code 201", async () => {
    const response = await user.login("test2", "Tester123!");
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});

describe("Create Community - With login", () => {
  let response = "";

  beforeAll(async () => {
    await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(
      newComTitle,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a successful response - code 201", () => {
    expect(response.status).toBe(201);
  });

  test("API returns description and title of new community", () => {
    expect("" + response.text + "").toContain(newComTitle);
    expect("" + response.text + "").toContain(newComDescript);
  });
});

describe("Create Community - With login, but community already exists", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.createCommunity(
      welComTitle,
      welComDescript,
      welComRules,
      "",
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community already exists."', () => {
    expect("" + response.text + "").toContain("Community already exists.");
  });
});

describe("Create Communities by Title - After Login, with token, but title is an array(1 element)", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      arrayCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Error."', () => {
    expect(response.text).toBe("Error.");
  });
});

describe("Create Communities by Title - After Login, with token, but title is an array(3 elements)", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      arrayCom2,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Error."', () => {
    expect(response.text).toBe("Error.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting an integer", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      intCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(201);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toContain("" + intCom + "");
  });
});

describe("Create Communities by Title - After Login, with token, but getting an boolean", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      boolCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting an object", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      community,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting a json object", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      jsonCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting a link", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      linkCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting special characters", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      specialCom,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting html entity codes", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      entityCodeComs,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Create Communities by Title - After Login, with token, but getting html code", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      htmlComs,
      newComDescript,
      newComRules,
      newComTags,
      token
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid Entry."', () => {
    expect(response.text).toBe("Invalid Entry.");
  });
});

describe("Deleting all createdCommunity", () => {
  test("API returns a successful response - code 200 (removes newComTitle)", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes integerCommunity)", async () => {
    response = await community.deleteCommunity(intCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes booleanCommunity)", async () => {
    response = await community.deleteCommunity(boolCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes arrayCommunity)", async () => {
    response = await community.deleteCommunity(arrayCom, token);
    expect(response.text).toBe("Heelllooo.");
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes second arrayCommunity)", async () => {
    response = await community.deleteCommunity(arrayCom2, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes jsonCommunity)", async () => {
    response = await community.deleteCommunity(jsonCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes objectCommunity)", async () => {
    response = await community.deleteCommunity(community, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes linkCommunity)", async () => {
    response = await community.deleteCommunity(linkCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes specialCommunity)", async () => {
    response = await community.deleteCommunity(specialCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes entityCommunity)", async () => {
    response = await community.deleteCommunity(entityCodeComs, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes htmlCommunity)", async () => {
    response = await community.deleteCommunity(htmlComs, token);
    expect(response.status).toBe(200);
  });
});
