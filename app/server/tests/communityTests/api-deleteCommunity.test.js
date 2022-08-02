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

const newComTitle = `delete Community - ${userName}`;
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
describe("Testing DELETE /community endpoint", () => {
  afterAll(async () => {
    await community.deleteAllCommunities();
    await auth.deleteUsers();
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

  describe("Delete Communities - After Login", () => {
    let response = "";

    beforeAll(async () => {
      response = await community.createCommunity(
        newComTitle,
        newComDescript,
        token,
        newComRules,
        newComTags
      );
      response = await community.deleteCommunity(newComTitle, token);
    });

    test("API returns a successful response - code 204", () => {
      expect(response.status).toBe(204);
    });
  });

  describe("Get Community by Title - With Login, testing with new Community after the deletion", () => {
    let response = "";

    beforeAll(async () => {
      response = await community.getCommunitybyTitle(newComTitle, token);
    });

    test("API returns a unsuccessful response - code 404", () => {
      expect(response.status).toBe(403);
    });

    test('API returns description -  "Community has been removed."', () => {
      expect(response.text).toBe("Community has been removed.");
    });
  });

  describe("Delete Communities - After Login, community does not exist", () => {
    let response = "";

    beforeAll(async () => {
      response = await community.deleteCommunity(newComTitle, token);
    });

    test("API returns a successful response - code 404", () => {
      expect(response.status).toBe(403);
    });

    test('API returns description - "Community has been removed."', () => {
      expect(response.text).toBe("Community has been removed.");
    });
  });
});
