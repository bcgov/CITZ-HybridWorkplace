/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
const { AuthFunctions } = require("../functions/authFunctions");
const { PostFunctions } = require("../functions/postFunctions");
const { CommunityFunctions } = require("../functions/communityFunctions");
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

const community = new CommunityFunctions();
const auth = new AuthFunctions();
const post = new PostFunctions();

describe("Testing GET /post/flags endpoint", () => {
  describe("Testing user's ability to GET Post Flags", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();
    const flags = [
      "Inappropriate",
      "Hate",
      "Harassment or Bullying",
      "Spam",
      "Misinformation",
      "Against Community Rules",
    ];

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);

      // Create some communities
      await community.createCommunity(
        communityName,
        randomText,
        loginResponse.body.token
      );

      // Join communities
      await community.joinCommunity(communityName, loginResponse.body.token);

      // Create some posts
      postResponse = await post.createPost(
        randomText,
        randomText,
        communityName,
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity(communityName, loginResponse.body.token);
      await auth.deleteUsers();
    });

    test("User can get existing flags made with their account - returns 200", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[2],
        loginResponse.body.token
      );
      await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      response = await post.getPostFlags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    // TODO: currently returns 400
    test("User cannot get flags with an invalid post id - returns 404", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[1],
        loginResponse.body.token
      );
      response = await post.getPostFlags("invalidID", loginResponse.body.token);
      expect(response.status).toBe(404);
    });

    test("User cannot get flags with an invalid token - returns 401", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[4],
        loginResponse.body.token
      );
      response = await post.getPostFlags(
        postResponse.body._id,
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWY4YTI3NDI0MDdmMWViZmUwZjVmMiIsInVzZXJuYW1lIjoiaGVscCIsImVtYWlsIjoiaGVscEBnb3YuYmMuY2EiLCJpYXQiOjE2NTQ3MTA4MDIsImV4cCI6MTY1NDcxMTQwMn0.xCEveZWfewI6dTmoifcqWT2Zyg0w8nzAxd9RSGiiTmA"
      );
      expect(response.status).toBe(401);
    });
  });

  describe("Testing limitations of post id field", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();
    const flags = [
      "Inappropriate",
      "Hate",
      "Harassment or Bullying",
      "Spam",
      "Misinformation",
      "Against Community Rules",
    ];

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);

      // Create some communities
      await community.createCommunity(
        communityName,
        randomText,
        loginResponse.body.token
      );

      // Join communities
      await community.joinCommunity(communityName, loginResponse.body.token);

      // Create some posts
      postResponse = await post.createPost(
        randomText,
        randomText,
        communityName,
        loginResponse.body.token
      );

      // Set some flags
      await post.setPostFlags(
        postResponse.body._id,
        flags[2],
        loginResponse.body.token
      );

      await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity(communityName, loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as post id", () => {
      test("Positive integer", async () => {
        response = await post.getPostFlags(
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.getPostFlags(
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.getPostFlags(
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.getPostFlags(
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.getPostFlags(0, loginResponse.body.token);
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Very large string", async () => {
        response = await post.getPostFlags(
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      if (RUN_BREAKING_TESTS === "true") {
        test("Empty string", async () => {
          response = await post.getPostFlags("", loginResponse.body.token);
          expect(response.status).toBe(404);
        });

        test("URL", async () => {
          response = await post.getPostFlags(
            "https://github.com/bcgov/CITZ-HybridWorkplace",
            loginResponse.body.token
          );
          expect(response.status).toBe(404);
        });

        test("Special characters", async () => {
          response = await post.getPostFlags(
            characters.gen(),
            loginResponse.body.token
          );
          expect(response.status).toBe(404);
        });
      }
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.getPostFlags(null, loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.getPostFlags(
          { _id: postResponse.body._id },
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.getPostFlags(
          [postResponse.body._id, postResponse.body._id],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });
});
