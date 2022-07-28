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
describe("Testing GET /post endpoint", () => {
  describe("Testing user's ability to get posts from their communities", () => {
    let loginResponse;
    let response;
    const userName = name.gen();
    const userPassword = password.gen();

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        `GET Posts 1`,
        "Meow",
        loginResponse.body.token
      );
      await community.createCommunity(
        `GET Posts 2`,
        "What?",
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity("GET Posts 1", loginResponse.body.token);
      await community.joinCommunity("GET Posts 2", loginResponse.body.token);
      // Create some posts
      await post.createPost(
        "Post 1",
        "GOGOGO",
        "GET Posts 1",
        loginResponse.body.token
      );
      await post.createPost(
        "Post 2",
        "Ahahah",
        "GET Posts 2",
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("GET Posts 1", loginResponse.body.token);
      await community.deleteCommunity("GET Posts 2", loginResponse.body.token);
      await auth.deleteUsers();
    });

    test("All posts are returned upon request - returns 200", async () => {
      response = await post.getAllPosts(loginResponse.body.token);
      expect(response.status).toBe(200);
      let post1;
      let post2;
      response.body.forEach((element) => {
        if (element.title === "Post 1") post1 = true;
        if (element.title === "Post 2") post2 = true;
      });
      expect(post1).toBe(true);
      expect(post2).toBe(true);
    });

    test("Post with specific ID is returned - returns 200", async () => {
      const postResponse = await post.createPost(
        "Meow Mix",
        "Please deliver",
        "GET Posts 1",
        loginResponse.body.token
      );
      const id = postResponse.body._id;
      response = await post.getPostById(id, loginResponse.body.token);
      expect(response.status).toBe(200);
    });

    // TODO: Currently returns 400
    test("Post with a non-existant id is not returned - returns 404", async () => {
      response = await post.getPostById(
        "whoablackbetty",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("Post is not returned when using invalid token - returns 401", async () => {
      const postResponse = await post.createPost(
        "Meow Mix",
        "Please deliver",
        "GET Posts 1",
        loginResponse.body.token
      );
      const id = postResponse.body._id;
      response = await post.getPostById(id, "mytokenisnotgood");
      expect(response.status).toBe(401);
    });

    // TODO: Currently returns 401, but user is authorized, just not for this.
    test("Post is not returned if user is not part of that community - returns 403", async () => {
      const postResponse = await post.createPost(
        "Meow Mix",
        "Please deliver",
        "GET Posts 1",
        loginResponse.body.token
      );
      const id = postResponse.body._id;
      await auth.register("Pete", "pete@gmail.com", userPassword);
      const tempLoginResponse = await auth.login("Pete", "pete@gmail.com");
      response = await post.getPostById(id, tempLoginResponse.body.token);
      expect(response.status).toBe(403);
    });
  });

  describe("Testing limitations of post id field", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();

    beforeAll(async () => {
      // Set up user
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      // Create some communities
      await community.createCommunity(
        `GET Posts 1`,
        "Meow",
        loginResponse.body.token
      );
      await community.createCommunity(
        `GET Posts 2`,
        "What?",
        loginResponse.body.token
      );
      // Join communities
      await community.joinCommunity("GET Posts 1", loginResponse.body.token);
      await community.joinCommunity("GET Posts 2", loginResponse.body.token);
      // Create some posts
      postResponse = await post.createPost(
        "Post 1",
        "GOGOGO",
        "GET Posts 1",
        loginResponse.body.token
      );
      await post.createPost(
        "Post 2",
        "Ahahah",
        "GET Posts 2",
        loginResponse.body.token
      );
    });

    afterAll(async () => {
      await post.deleteAllPosts();
      await community.deleteCommunity("GET Posts 1", loginResponse.body.token);
      await community.deleteCommunity("GET Posts 2", loginResponse.body.token);
      await auth.deleteUsers();
    });

    describe("Sending numbers as post id", () => {
      test("Positive integer", async () => {
        response = await post.getPostById(
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Positive decimal", async () => {
        response = await post.getPostById(
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative integer", async () => {
        response = await post.getPostById(
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Negative decimal", async () => {
        response = await post.getPostById(
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Zero", async () => {
        response = await post.getPostById(0, loginResponse.body.token);
        expect(response.status).toBe(404);
      });
    });

    describe("Sending strings as post id", () => {
      test("Empty string", async () => {
        response = await post.getPostById("", loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("Very large string", async () => {
        response = await post.getPostById(
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("URL", async () => {
        response = await post.getPostById(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Special characters", async () => {
        response = await post.getPostById(
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });

    describe("Sending other things as post id", () => {
      test("Null", async () => {
        response = await post.getPostById(null, loginResponse.body.token);
        expect(response.status).toBe(404);
      });

      test("JS object", async () => {
        response = await post.getPostById(
          { id: postResponse.body._id },
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });

      test("Array", async () => {
        response = await post.getPostById(
          [postResponse.body._id, postResponse.body._id],
          loginResponse.body.token
        );
        expect(response.status).toBe(404);
      });
    });
  });
});
