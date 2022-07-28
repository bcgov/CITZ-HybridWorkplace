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
const welComDescript = "Welcome to theNeighbourhood";
const welComRules = [];

const newComTitle = "Create community";
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

describe("Create Community - With login", () => {
  let response = "";

  beforeAll(async () => {
    await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(
      newComTitle,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a successful response - code 201", () => {
    expect(response.status).toBe(201);
  });

  test("API returns description and title of new community", () => {
    expect(`${response.text}`).toContain(newComTitle);
    expect(`${response.text}`).toContain(newComDescript);
  });
});

describe("Create Community - With login, but community already exists", () => {
  let response = "";

  beforeAll(async () => {
    response = await community.createCommunity(
      welComTitle,
      welComDescript,
      token,
      welComRules,
      []
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community already exists."', () => {
    expect(`${response.text}`).toContain("Community already exists.");
  });
});

describe("Create Communities by Title - After Login, with token, but title is an array(1 element)", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      arrayCom,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 400", () => {
    expect(response.status).toBe(400);
  });

  test('API returns description -  "Bad Request: TypeError: string.trim is not a function"', () => {
    expect(response.text).toBe(
      "Bad Request: TypeError: string.trim is not a function"
    );
  });
});

describe("Create Communities by Title - After Login, with token, but title is an array(3 elements)", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      arrayCom2,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 400", () => {
    expect(response.status).toBe(400);
  });

  test('API returns description -  "Bad Request: TypeError: string.trim is not a function"', () => {
    expect(response.text).toBe(
      "Bad Request: TypeError: string.trim is not a function"
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting an integer", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      intCom,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 400", () => {
    expect(response.status).toBe(400);
  });

  test('API returns description -  "Bad Request: TypeError: string.trim is not a function"', () => {
    expect(response.text).toContain(
      "Bad Request: TypeError: string.trim is not a function"
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting an boolean", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      boolCom,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 400", () => {
    expect(response.status).toBe(400);
  });

  test('API returns description -  "Bad Request: ValidationError: title: Path `title` is required."', () => {
    expect(response.text).toBe(
      "Bad Request: ValidationError: title: Path `title` is required."
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting an object", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      community,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 400", () => {
    expect(response.status).toBe(400);
  });

  test('API returns description -  "Bad Request: TypeError: string.trim is not a function."', () => {
    expect(response.text).toBe(
      "Bad Request: TypeError: string.trim is not a function"
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting a json object", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      jsonCom,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."', () => {
    expect(response.text).toBe(
      "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting a link", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      linkCom,
      newComDescript,
      token,
      newComRules,
      newComTags
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
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."', () => {
    expect(response.text).toBe(
      "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting html entity codes", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      entityCodeComs,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."', () => {
    expect(response.text).toBe(
      "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."
    );
  });
});

describe("Create Communities by Title - After Login, with token, but getting html code", () => {
  beforeAll(async () => {
    response = await community.createCommunity(
      htmlComs,
      newComDescript,
      token,
      newComRules,
      newComTags
    );
  });

  test("API returns a unsuccessful response - code 403", () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."', () => {
    expect(response.text).toBe(
      "title does not meet requirements: length 3-25, must not contain characters (\\/@*^_+-=`~][{}:;<>)."
    );
  });
});

describe("Deleting all createdCommunity", () => {
  test("API returns a successful response - code 200 (removes all Communities)", async () => {
    response = await community.deleteAllCommunities();
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes newComTitle)", async () => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes linkCommunity)", async () => {
    response = await community.deleteCommunity(linkCom, token);
    expect(response.status).toBe(200);
  });

  test("API returns a successful response - code 200 (removes htmlCommunity)", async () => {
    response = await community.deleteCommunity(htmlComs, token);
    expect(response.status).toBe(200);
  });
});

describe("Deleting a test user", () => {
  test("API returns a successful response - code 204", async () => {
    const response = await user.deleteUserByName(token, userName);
    expect(response.status).toBe(204);
  });
});
