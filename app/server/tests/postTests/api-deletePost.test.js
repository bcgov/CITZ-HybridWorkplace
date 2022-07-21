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

describe("Testing DELETE /post endpoint", () => {
  describe("Testing user's ability to delete posts from their communities", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    let postResponse;
    const communityName = name.gen();

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        communityName,
        "Meow",
        "Always feeding time",
        [],
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity(communityName, loginResponse.body.token);
      // Create some posts
      postResponse = await post.createPost(
        name.gen(),
        "GOGOGO",
        communityName,
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity(communityName, loginResponse.body.token);
      await auth.deleteUsers();
    });

    test("User can delete posts by id - returns 204", async () => {
      response = await post.deletePost(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(204); // Post deleted
      response = await post.getPostById(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(404); // Post now gone
    });

    test("User cannot delete posts with an invalid token - returns 401", async () => {
      const tempPostResponse = await post.createPost(
        "Charge!",
        "GOGOGO",
        communityName,
        loginResponse.body.token
      ); // Create post
      response = await post.deletePost(tempPostResponse.body._id, "badbadbad");
      expect(response.status).toBe(401); // Post not deleted, invalid token
      response = await post.getPostById(
        tempPostResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(200); // Post still there
    });

    // TODO: Currently returns 400
    test("User cannot delete posts when not the author of the post - returns 403", async () => {
      const tempName = name.gen();
      const tempPassword = password.gen();
      await auth.register(tempName, email.gen(), tempPassword); // Make new user
      const tempLoginResponse = await auth.login(tempName, tempPassword);
      postResponse = await post.createPost(
        "Charge!",
        "GOGOGO",
        communityName,
        tempLoginResponse.body.token
      ); // New user posts

      response = await post.deletePost(
        postResponse.body._id,
        loginResponse.body.token
      ); // Original user tries to delete
      expect(response.status).toBe(403); // Post not deleted
    });

    // TODO: Currently returns 400
    test("User cannot delete posts when not part of the community - returns 403", async () => {
      const tempName = name.gen();
      const tempPassword = password.gen();
      await auth.register(tempName, email.gen(), tempPassword); // Make new user
      const tempLoginResponse = await auth.login(tempName, tempPassword);
      postResponse = await post.createPost(
        "Charge!",
        "GOGOGO",
        communityName,
        tempLoginResponse.body.token
      ); // Post
      await community.leaveCommunity(
        communityName,
        tempLoginResponse.body.token
      ); // Leave community
      response = await post.deletePost(
        postResponse.body._id,
        tempLoginResponse.body.token
      ); // Try to delete post
      expect(response.status).toBe(403); // Post not deleted
    });

    test("User cannot delete posts with an invalid id - returns 404", async () => {
      response = await post.deletePost(
        "showmeyourid",
        loginResponse.body.token
      );
      expect(response.status).toBe(404); // Post does not exist
    });
  });

  describe("Testing limitations of post id field", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    let postResponse;
    const communityName = name.gen();

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        communityName,
        "Meow",
        "Always feeding time",
        [],
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity(communityName, loginResponse.body.token);
    });

    beforeEach(async () => {
      // Create some posts
      postResponse = await post.createPost(
        name.gen(),
        "GOGOGO",
        communityName,
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
        response = await post.deletePost(
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.deletePost(
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.deletePost(
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.deletePost(
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.deletePost(0, loginResponse.body.token);
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Empty string", async () => {
        response = await post.deletePost("", loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("Very large string", async () => {
        response = await post.deletePost(
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("URL", async () => {
        response = await post.deletePost(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Special characters", async () => {
        response = await post.deletePost(
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.deletePost(null, loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.deletePost(
          { _id: postResponse.body._id },
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.deletePost(
          [postResponse.body._id, postResponse.body._id],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });
});
