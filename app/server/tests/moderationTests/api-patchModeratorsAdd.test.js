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
      response = await community.createCommunity(
        communityName,
        "Description goes here",
        loginResponse1.body.token
      );
    });

    afterAll(async () => {
      await community.deleteAllCommunities();
      await auth.deleteUsers();
    });

    test("User not part of community cannot be a mod", async () => {
      // Founding member tries to add mod
      response = await community.addModerator(
        communityName,
        username2,
        [],
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

    test("User who is not a mod cannot add other mods", async () => {
      // Create new user, join community
      const newUsername = name.gen();
      await auth.register(newUsername, email.gen(), userPassword);
      const tempLoginResponse = await auth.login(newUsername, userPassword);
      await community.joinCommunity(
        communityName,
        tempLoginResponse.body.token
      );

      // Another user who is not a mod tries to add them
      response = await community.addModerator(
        communityName,
        newUsername,
        [],
        loginResponse2.body.token
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

    test("User who is part of a community can be a mod", async () => {
      // User 2 joins community
      await community.joinCommunity(communityName, loginResponse2.body.token);

      // User 1 tries to add them as a mod
      response = await community.addModerator(
        communityName,
        username2,
        [],
        loginResponse1.body.token
      );

      expect(response.status).toBe(204);

      // Moderator list should now be 2 long.
      response = await community.getModerators(
        communityName,
        loginResponse2.body.token,
        true
      );

      expect(response.body.count).toBe(2);
    });

    test("Mod with no permissions cannot add other mods", async () => {
      // Create temp user who joins community
      const newUsername = name.gen();
      await auth.register(newUsername, email.gen(), userPassword);
      const tempLoginResponse = await auth.login(newUsername, userPassword);
      await community.joinCommunity(
        communityName,
        tempLoginResponse.body.token
      );

      // User 2 should have no permisisons. Tries to add temp user as mod
      response = await community.addModerator(
        communityName,
        newUsername,
        [],
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
  });
});
