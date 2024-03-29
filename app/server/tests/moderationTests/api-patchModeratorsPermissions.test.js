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
        loginResponse1.body.token
      );

      // User2 joins community
      await community.joinCommunity(communityName, loginResponse2.body.token);
    });

    afterAll(async () => {
      await community.deleteAllCommunities();
      await auth.deleteUsers();
    });

    test("User cannot edit mod permissions if not a mod", async () => {
      // User2 tries to change User1 permissions
      response = await community.setModPermissions(
        communityName,
        username1,
        [],
        loginResponse2.body.token
      );

      expect(response.status).toBe(403);
    });

    test("Moderator cannot remove their permissions if they only have those permissions", async () => {
      // User1 tries to change User1 permissions
      response = await community.setModPermissions(
        communityName,
        username1,
        [],
        loginResponse2.body.token
      );

      expect(response.status).toBe(403);
    });

    test("Moderator with no permissions cannot change permissions of other mods", async () => {
      // User1 promotes User2 to mod
      await community.addModerator(
        communityName,
        username2,
        [],
        loginResponse1.body.token
      );

      // User2 tries to remove User1's permissions
      response = await community.setModPermissions(
        communityName,
        username1,
        [],
        loginResponse2.body.token
      );

      expect(response.status).toBe(403);
    });

    test("Moderator with full permissions can add permissions to other mod", async () => {
      // User1 adds permissions to User2
      response = await community.setModPermissions(
        communityName,
        username2,
        ["set_moderators", "set_permissions", "remove_community"],
        loginResponse1.body.token
      );

      expect(response.status).toBe(204);
    });

    test("Moderator can remove their permissions if another mod has them as well", async () => {
      // User1 removes permissions from self
      response = await community.setModPermissions(
        communityName,
        username1,
        [],
        loginResponse1.body.token
      );

      expect(response.status).toBe(204);
    });
  });
});
