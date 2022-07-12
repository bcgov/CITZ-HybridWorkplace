/* eslint-disable max-lines */
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

describe("Testing DELETE /post/flags endpoint", () => {
  describe("Testing user's ability to DELETE Post Flags", () => {
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
        randomText,
        [],
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

    test("User can delete flags that they set - returns 204", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      response = await post.deletePostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
    });

    test("If user deletes a flag when multiple are present, only the one is deleted", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      await post.setPostFlags(
        postResponse.body._id,
        flags[1],
        loginResponse.body.token
      );
      response = await post.deletePostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
      response = await post.getPostFlags(
        postResponse.body._id,
        loginResponse.body.token
      );
      const flaggedArray1 = response.body[0].flaggedBy;
      const flaggedArray2 = response.body[1].flaggedBy;
      expect(flaggedArray1).toHaveLength(0);
      expect(flaggedArray2).toHaveLength(1);
    });

    // TODO: Currently returns 403, but this isn't a restricted action, the flag just isn't there
    test("User cannot delete flags that have not been set - returns 403", async () => {
      response = await post.deletePostFlags(
        postResponse.body._id,
        flags[5],
        loginResponse.body.token
      );
      expect(response.status).toBe(403); // User has not flagged this
    });

    test("User cannot delete flags that do not exist in acceptable flags list - returns 403", async () => {
      response = await post.deletePostFlags(
        postResponse.body._id,
        "myCustomFlag",
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
    });

    // TODO: Currently returns 400, expected 404
    test("User cannot delete flags using an invalid post id - returns 404", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        loginResponse.body.token
      );
      response = await post.deletePostFlags(
        "bad id",
        flags[0],
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("User cannot delete flags using an invalid token - returns 401", async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[4],
        loginResponse.body.token
      );
      response = await post.deletePostFlags(
        postResponse.body._id,
        flags[4],
        "bad token"
      );
      expect(response.status).toBe(401);
    });

    test("User cannot delete flags set by another user - returns 403", async () => {
      // Set up temp user and flag
      await auth.register("Ted", email.gen(), userPassword);
      const tempLoginResponse = await auth.login("Ted", userPassword);
      await community.joinCommunity(
        communityName,
        tempLoginResponse.body.token
      );
      await post.setPostFlags(
        postResponse.body._id,
        flags[5],
        tempLoginResponse.body.token
      );

      // Original user tries to delete flag
      await post.deletePostFlags(
        postResponse.body._id,
        flags[5],
        loginResponse.body.token
      );
      response = await post.getPostFlags(
        postResponse.body._id,
        loginResponse.body.token
      );
      const flaggedArray = response.body[0].flaggedBy;
      expect(flaggedArray).toHaveLength(1); // Should still show that 'Ted' flagged it
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
        randomText,
        [],
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

    // In case one actually deletes
    beforeEach(async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[5],
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
        response = await post.deletePostFlags(
          positiveInt.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.deletePostFlags(
          positive.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.deletePostFlags(
          negativeInt.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.deletePostFlags(
          negative.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.deletePostFlags(
          0,
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Empty string", async () => {
        response = await post.deletePostFlags(
          "",
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Very large string", async () => {
        response = await post.deletePostFlags(
          largeString.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("URL", async () => {
        response = await post.deletePostFlags(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Special characters", async () => {
        response = await post.deletePostFlags(
          characters.gen(),
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.deletePostFlags(
          null,
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.deletePostFlags(
          { _id: postResponse.body._id },
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.deletePostFlags(
          [postResponse.body._id, postResponse.body._id],
          flags[5],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });

  describe("Testing limitations of flag field", () => {
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
        randomText,
        [],
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

    // In case one actually deletes
    beforeEach(async () => {
      await post.setPostFlags(
        postResponse.body._id,
        flags[5],
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity(communityName, loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as flag", () => {
      test("Positive integer", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          0,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as flag", () => {
      test("Empty string", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          "",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as flag", () => {
      test("Null", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          null,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          { flag: flags[5] },
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.deletePostFlags(
          postResponse.body._id,
          [flags[5], flags[5]],
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });
});
