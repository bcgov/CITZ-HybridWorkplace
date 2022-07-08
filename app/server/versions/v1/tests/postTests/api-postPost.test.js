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

describe("Testing POST /post endpoint", () => {
  describe("Testing user's ability to make posts", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();

    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await auth.deleteUsers();
    });

    test("Post can successfully be created - returns 201", async () => {
      response = await post.createPost(
        "My first post",
        "Check this out",
        "Welcome",
        loginResponse.body.token
      );
      expect(response.status).toBe(201);
    });

    // TODO: Currently allows for duplicate posts
    test("Post that matches existing post fails - returns 403", async () => {
      response = await post.createPost(
        "My first post",
        "Check this out",
        "Welcome",
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
    });

    test("Post with non-existant community fails - returns 404", async () => {
      response = await post.createPost(
        "My first post",
        "Check this out",
        "SonicOCFanclub",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("Post on community user doesn't belong to fails - returns 403", async () => {
      await community.createCommunity(
        "TempCommunity",
        "test",
        "no rules",
        [],
        loginResponse.body.token
      );
      response = await post.createPost(
        "My first post",
        "Check this out",
        "TempCommunity",
        loginResponse.body.token
      );
      await community.deleteCommunity(
        "TempCommunity",
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
    });

    test("Post when user is not logged in fails (invalid token) - returns 401", async () => {
      response = await post.createPost(
        "My last post",
        "Check this out",
        "Welcome",
        "noToken"
      );
      expect(response.status).toBe(401); // Invalid token
    });
  });

  describe("Testing posts with unexpected inputs", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();

    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await auth.deleteUsers();
    });

    test("Post creation is refused when a bad token is given - returns 401", async () => {
      response = await post.createPost(
        "My first post",
        "Check this out",
        "Welcome",
        "mybadtoken"
      );
      expect(response.status).toBe(401); // Invalid token
    });

    test("Post creation is refused when a non-existant community is given - returns 404", async () => {
      response = await post.createPost(
        "My last post",
        "Check this out",
        "DogsOnFrogs",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });
  });

  describe("Testing limitations on Title field", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    const content = name.gen();

    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      await community.createCommunity(
        "PostPost",
        "Testing POST /post",
        "no rules",
        [],
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("PostPost", loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as Title", () => {
      test("Positive integer", async () => {
        response = await post.createPost(
          positiveInt.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await post.createPost(
          positive.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await post.createPost(
          negativeInt.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await post.createPost(
          negative.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await post.createPost(
          0,
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as title", () => {
      test("Empty string", async () => {
        response = await post.createPost(
          "",
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.createPost(
          largeString.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await post.createPost(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await post.createPost(
          characters.gen(),
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as title", () => {
      test("Null", async () => {
        response = await post.createPost(
          null,
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.createPost(
          { title: "Object title" },
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.createPost(
          ["array title", "array title"],
          content,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });

  describe("Testing limitations on Content field", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();
    const title = name.gen();

    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      await community.createCommunity(
        "PostPost",
        "Testing POST /post",
        "no rules",
        [],
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("PostPost", loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as content", () => {
      test("Positive integer", async () => {
        response = await post.createPost(
          title,
          positiveInt.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await post.createPost(
          title,
          positive.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await post.createPost(
          title,
          negativeInt.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await post.createPost(
          title,
          negative.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await post.createPost(
          title,
          0,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as content", () => {
      test("Empty string", async () => {
        response = await post.createPost(
          title,
          "",
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.createPost(
          title,
          largeString.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await post.createPost(
          title,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await post.createPost(
          title,
          characters.gen(),
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as content", () => {
      test("Null", async () => {
        response = await post.createPost(
          title,
          null,
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.createPost(
          title,
          { content: "This is my post content" },
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.createPost(
          title,
          ["content goes here", "content goes there"],
          "PostPost",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });
});
