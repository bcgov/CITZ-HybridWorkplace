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
    const periods = ["test", "hour", "day", "week", "forever"];

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

    test("Moderator cannot kick another moderator", async () => {
      // User2 becomes mod
      await community.addModerator(
        communityName,
        username2,
        [],
        loginResponse1.body.token
      );

      // User1 tries to kick User2
      response = await community.kickUser(
        communityName,
        username2,
        periods[0],
        loginResponse1.body.token
      );

      expect(response.status).toBe(403);
    });

    test("Moderator cannot kick another moderator without specifiying period", async () => {
      // Remove User2 as mod just in case
      await community.removeModerator(
        communityName,
        username2,
        loginResponse1.body.token
      );

      // User1 tries to kick User2, but forgets period
      response = await community.kickUser(
        communityName,
        username2,
        "",
        loginResponse1.body.token
      );

      expect(response.status).toBe(403);
    });

    test("When moderator kicks user, user cannot re-join community", async () => {
      // Remove User2 as mod just in case
      await community.removeModerator(
        communityName,
        username2,
        loginResponse1.body.token
      );

      // User1 kicks User2
      response = await community.kickUser(
        communityName,
        username2,
        periods[0],
        loginResponse1.body.token
      );

      expect(response.status).toBe(204);

      // User2 tries to rejoin
      response = await community.joinCommunity(
        communityName,
        loginResponse2.body.token
      );
      expect(response.status).toBe(403);
    });
  });
});
