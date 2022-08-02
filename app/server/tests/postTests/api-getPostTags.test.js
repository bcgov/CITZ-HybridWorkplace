/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
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
describe("Testing GET /post/tags endpoint", () => {
  describe("Testing user's ability to GET Post Tags", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();
    const tag1 = "great";

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);

      // Create some communities
      await community.createCommunity(
        communityName,
        randomText,
        loginResponse.body.token,
        [],
        [{ tag: tag1, description: "also great" }]
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

      // Tag that post
      await post.setPostTags(
        postResponse.body._id,
        tag1,
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity(communityName, loginResponse.body.token);
      await auth.deleteUsers();
    });

    test("User can retrieve existing tags as expected.", async () => {
      response = await post.getPostTags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            tag: tag1,
            taggedBy: expect.any(Array),
            _id: expect.any(String),
          },
        ])
      );
    });

    // TODO: Currently returns 400
    test("User receives 404 error when post does not exist", async () => {
      response = await post.getPostTags(
        "jkldsfjiowhiowekldhf",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("User receives 401 error when using an invalid token", async () => {
      response = await post.getPostTags(
        postResponse.body._id,
        "invalidtokensRus"
      );
      expect(response.status).toBe(401);
    });
  });

  describe("Testing limitations on post id field", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();
    const tag1 = "great";

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);

      // Create some communities
      await community.createCommunity(
        communityName,
        randomText,
        loginResponse.body.token,
        [],
        [{ tag: tag1, description: "also great" }]
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

      // Tag that post
      await post.setPostTags(
        postResponse.body._id,
        tag1,
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
        response = await post.getPostTags(
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.getPostTags(
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.getPostTags(
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.getPostTags(
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.getPostTags(0, loginResponse.body.token);
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Very large string", async () => {
        response = await post.getPostTags(
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      if (process.env.RUN_BREAKING_TESTS === "true") {
        test("Empty string", async () => {
          response = await post.getPostTags("", loginResponse.body.token);
          expect(response.status).toBe(404);
        });

        test("URL", async () => {
          response = await post.getPostTags(
            "https://github.com/bcgov/CITZ-HybridWorkplace",
            loginResponse.body.token
          );
          expect(response.status).toBe(404);
        });

        test("Special characters", async () => {
          response = await post.getPostTags(
            characters.gen(),
            loginResponse.body.token
          );
          expect(response.status).toBe(404);
        });
      }
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.getPostTags(null, loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.getPostTags(
          { _id: postResponse.body._id },
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.getPostTags(
          [postResponse.body._id, postResponse.body._id],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });
});
