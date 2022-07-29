/* eslint-disable no-undef */
const { AuthFunctions } = require("../functions/authFunctions");
const { CommunityFunctions } = require("../functions/communityFunctions");
const user = require("../functions/userFunctions");
const {
  password,
  name,
  email,
  positive,
  positiveInt,
  negative,
  negativeInt,
  largeString,
  characters,
} = require("../functions/randomizer");

const auth = new AuthFunctions();
const community = new CommunityFunctions();

describe("Testing GET /community/moderators/{title} endpoint", () => {
  describe("Testing expected behaviours of endpoint", () => {
    const username1 = name.gen();
    const username2 = name.gen();
    const userPassword = password.gen();
    const communityName = `getMods - ${username1}`;
    let response;
    let loginResponse1;
    let loginResponse2;

    beforeAll(async () => {
      // Create users and log in
      await auth.register(username1, email.gen(), userPassword);
      await auth.register(username2, email.gen(), userPassword);
      loginResponse1 = await auth.login(username1, userPassword);
      loginResponse2 = await auth.login(username2, userPassword);

      // User1 creates community (becomes mod)
      response = await community.createCommunity(
        communityName,
        "Description goes here",
        // "No rules",
        // [],
        loginResponse1.body.token
      );
    });

    afterAll(async () => {
      await community.deleteAllCommunities();
      await auth.deleteUsers();
    });

    test("User not part of community can get mod list", async () => {
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    test("If user joins community, they can still get mod list", async () => {
      await community.joinCommunity(communityName, loginResponse2.body.token);

      response = await community.getModerators(
        communityName,
        loginResponse2.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    test("Optional count query works as expected", async () => {
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token,
        true
      );
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(1);
    });
  });
});
