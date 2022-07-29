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

describe("Testing DELETE /post/tags endpoint", () => {
  describe("Testing user's ability to DELETE Post Tags", () => {
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

    test("User can delete existing post tag.", async () => {
      console.log(postResponse.body);
      response = await post.deletePostTags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
      response = await post.getPostTags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          {
            tag: tag1,
            taggedBy: expect.any(Array),
            _id: expect.any(String),
          },
        ])
      );
    });

    test("User receives 403 error when post has not been tagged", async () => {
      const tempPostResponse = await post.createPost(
        randomText,
        randomText,
        communityName,
        loginResponse.body.token
      );
      response = await post.deletePostTags(
        tempPostResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
    });

    test("User receives 401 error when using an invalid token", async () => {
      await post.setPostTags(
        postResponse.body._id,
        tag1,
        loginResponse.body.token
      );
      response = await post.deletePostTags(
        postResponse.body._id,
        "invalidtokensRus"
      );
      expect(response.status).toBe(401);
    });

    // TODO: Currently returns 400
    test("User receives 404 error when trying to delete tags from non-existant post", async () => {
      response = await post.deletePostTags(
        "htkeiodjkfldsjifo",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
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
        [{ tag: tag1, count: 1 }]
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
        response = await post.deletePostTags(
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.deletePostTags(
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.deletePostTags(
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.deletePostTags(
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.deletePostTags(0, loginResponse.body.token);
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Empty string", async () => {
        response = await post.deletePostTags("", loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("Very large string", async () => {
        response = await post.deletePostTags(
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("URL", async () => {
        response = await post.deletePostTags(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Special characters", async () => {
        response = await post.deletePostTags(
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.deletePostTags(null, loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.deletePostTags(
          { id: postResponse.body._id },
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.deletePostTags(
          [postResponse.body._id, postResponse.body._id],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });
});
