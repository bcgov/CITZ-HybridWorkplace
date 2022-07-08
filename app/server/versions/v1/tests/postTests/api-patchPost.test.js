/* eslint-disable no-underscore-dangle */
/* eslint-disable max-lines */
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

describe("Testing PATCH /post endpoint", () => {
  describe("Testing user's ability to edit posts from their communities", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    let postResponse;

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        "PATCH Posts",
        "Posts",
        "Tests for PATCH posts",
        [],
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity("PATCH Posts", loginResponse.body.token);
      // Create some posts
      postResponse = await post.createPost(
        "Create this post",
        "GOGOGO",
        "PATCH Posts",
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("PATCH Posts", loginResponse.body.token);
      await auth.deleteUsers();
    });

    test("User can edit posts by id - returns 204", async () => {
      response = await post.editPost(
        postResponse.body._id,
        "Edit posts by id",
        "Edited",
        false,
        loginResponse.body.token
      );
      expect(response.status).toBe(204); // Post edited
      response = await post.getPostById(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body.title).toBe("Edit posts by id"); // Post title should match updated title
    });

    // TODO: currently returns 400
    test("User cannot edit posts with an invalid id - returns 404", async () => {
      response = await post.editPost(
        "D78943207",
        "Thundercats Retreat!",
        "Hijacked",
        false,
        loginResponse.body.token
      );
      expect(response.status).toBe(404); // Post not edited
    });

    test("User cannot edit posts where token is invalid - returns 401", async () => {
      response = await post.editPost(
        postResponse.body._id,
        "Thundercats Retreat!",
        "Hijacked",
        false,
        "flip those burgers"
      );
      expect(response.status).toBe(401); // Post not edited
    });

    // TODO?: currently succeeds with 204, but should it?
    test("User cannot edit posts where the user is no longer in the community - returns 403", async () => {
      await community.leaveCommunity("PATCH Posts", loginResponse.body.token);
      response = await post.editPost(
        postResponse.body._id,
        "Thundercats Retreat!",
        "Hijacked",
        false,
        loginResponse.body.token
      );
      expect(response.status).toBe(403); // Post not edited
    });
  });

  describe("Testing limitations on patching post title", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    let postResponse;
    const content = "This is the post content";

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        "PATCH Posts",
        "Posts",
        "Tests for PATCH posts",
        [],
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity("PATCH Posts", loginResponse.body.token);
      // Create some posts
      postResponse = await post.createPost(
        "Create this post",
        "GOGOGO",
        "PATCH Posts",
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("PATCH Posts", loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as title", () => {
      test("Positive integer", async () => {
        response = await post.editPost(
          postResponse.body._id,
          positiveInt.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Should this be a valid title?
      });

      test("Positive decimal", async () => {
        response = await post.editPost(
          postResponse.body._id,
          positive.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Should this be a valid title?
      });

      test("Negative integer", async () => {
        response = await post.editPost(
          postResponse.body._id,
          negativeInt.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Should this be a valid title?
      });

      test("Negative decimal", async () => {
        response = await post.editPost(
          postResponse.body._id,
          negative.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Should this be a valid title?
      });

      test("Zero", async () => {
        response = await post.editPost(
          postResponse.body._id,
          0,
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Length requirement?
      });
    });

    describe("Sending strings as title", () => {
      test("Empty string", async () => {
        response = await post.editPost(
          postResponse.body._id,
          "",
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.editPost(
          postResponse.body._id,
          largeString.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Length requirement?
      });

      test("URL", async () => {
        response = await post.editPost(
          postResponse.body._id,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });

      test("Special characters", async () => {
        response = await post.editPost(
          postResponse.body._id,
          characters.gen(),
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // If only special characters, should this be permitted?
      });
    });

    describe("Sending other things as title", () => {
      test("Null", async () => {
        response = await post.editPost(
          postResponse.body._id,
          null,
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.editPost(
          postResponse.body._id,
          { title: "My Object Title" },
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.editPost(
          postResponse.body._id,
          ["My Array Title", "My Array Title"],
          content,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });

  describe("Testing limitations on patching post content", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    let postResponse;
    const title = "This is the post title";

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        "PATCH Posts",
        "Posts",
        "Tests for PATCH posts",
        [],
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity("PATCH Posts", loginResponse.body.token);
      // Create some posts
      postResponse = await post.createPost(
        "Create this post",
        "GOGOGO",
        "PATCH Posts",
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("PATCH Posts", loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as Content", () => {
      test("Positive integer", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          positiveInt.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });

      test("Positive decimal", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          positive.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });

      test("Negative integer", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          negativeInt.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });

      test("Negative decimal", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          negative.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });

      test("Zero", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          0,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403); // Length requirement
      });
    });

    describe("Sending strings as Content", () => {
      test("Empty string", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          "",
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          largeString.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204);
      });

      test("URL", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204);
      });

      test("Special characters", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          characters.gen(),
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(204); // Maybe desired
      });
    });

    describe("Sending other things as Content", () => {
      test("Null", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          null,
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          { title: "My Object Content" },
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.editPost(
          postResponse.body._id,
          title,
          ["My Array Content", "My Array Content"],
          false,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });
});
