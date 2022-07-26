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

describe("Testing PATCH /community/moderators/add/{title} endpoint", () => {
  describe("Testing expected behaviours of endpoint", () => {
    const username1 = name.gen();
    const username2 = name.gen();
    const userPassword = password.gen();
    const communityName = `addMods - ${username1}`;
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
      await community.createCommunity(
        communityName,
        "Description goes here",
        // "No rules",
        // [],
        loginResponse1.body.token
      );

      // User2 joins community
      await community.joinCommunity(communityName, loginResponse2.body.token);

      // User1 promotes User2 to mod
      await community.addModerator(
        communityName,
        username2,
        [],
        loginResponse1.body.token
      );
    });

    afterAll(async () => {
      await community.deleteAllCommunities();
      await auth.deleteUsers();
    });

    test("Moderator with no permissions cannot remove other mods", async () => {
      // User2 tries to remove User1
      response = await community.removeModerator(
        communityName,
        username1,
        loginResponse2.body.token
      );

      expect(response.status).toBe(403);

      // Moderator list should still be 2 long.
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token,
        true
      );

      expect(response.body.count).toBe(2);
    });

    test("Moderator with full permissions can remove other mod", async () => {
      // User1 tries to remove User2
      response = await community.removeModerator(
        communityName,
        username2,
        loginResponse1.body.token
      );

      expect(response.status).toBe(204);

      // Moderator list should now be 1 long.
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token,
        true
      );

      expect(response.body.count).toBe(1);
    });

    test("Moderator cannot demote themselves if they are the last mod", async () => {
      // User1 tries to remove User1
      response = await community.removeModerator(
        communityName,
        username1,
        loginResponse1.body.token
      );

      expect(response.status).toBe(403);

      // Moderator list should still be 1 long.
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token,
        true
      );

      expect(response.body.count).toBe(1);
    });
  });
});
