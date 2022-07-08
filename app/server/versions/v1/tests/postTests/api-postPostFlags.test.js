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
const flags = [
  "Inappropriate",
  "Hate",
  "Harassment or Bullying",
  "Spam",
  "Misinformation",
  "Against Community Rules",
];

describe("Testing POST /post/flags endpoint", () => {
  describe("Testing user's ability to POST Post Flags", () => {
    let loginResponse;
    let response;
    let postResponse;
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();

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

    test("User can flag posts with flags that exist in dropdown", async () => {
      response = await post.setPostFlags(
        postResponse.body._id,
        flags[2],
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
      response = await post.getPostFlags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            _id: expect.any(String),
            flag: flags[2],
            flaggedBy: expect.any(Array),
          },
        ])
      );
    });

    test("User cannot flag posts with flags that do not exist in dropdown - returns 403", async () => {
      response = await post.setPostFlags(
        postResponse.body._id,
        `I just don't like them`,
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
      response = await post.getPostFlags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          {
            _id: expect.any(String),
            flag: `I just don't like them`,
            flaggedBy: expect.any(Array),
          },
        ])
      );
    });

    test("User can flag posts multiple times, but flag only added if unique - returns 204", async () => {
      // Need a clean post first
      const tempPostResponse = await post.createPost(
        randomText,
        randomText,
        communityName,
        loginResponse.body.token
      );
      // Trying to add same tag
      await post.setPostFlags(
        tempPostResponse.body._id,
        flags[3],
        loginResponse.body.token
      );
      response = await post.setPostFlags(
        tempPostResponse.body._id,
        flags[3],
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
      response = await post.getPostFlags(
        tempPostResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            _id: expect.any(String),
            flag: flags[3],
            flaggedBy: expect.any(Array),
          },
        ])
      );
      expect(response.body).toHaveLength(1);
      // Second, unique tag added
      response = await post.setPostFlags(
        tempPostResponse.body._id,
        flags[4],
        loginResponse.body.token
      );
      expect(response.status).toBe(204);
      response = await post.getPostFlags(
        tempPostResponse.body._id,
        loginResponse.body.token
      );
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            _id: expect.any(String),
            flag: flags[4],
            flaggedBy: expect.any(Array),
          },
        ])
      );
      expect(response.body).toHaveLength(2);
    });

    // TODO: currently returns 400
    test("User cannot flag posts using an invalid post id - returns 404", async () => {
      response = await post.setPostFlags(
        "jjdoijoj324jk",
        flags[0],
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("User cannot flag posts using an invalid token - returns 401", async () => {
      response = await post.setPostFlags(
        postResponse.body._id,
        flags[0],
        "invalidToken"
      );
      expect(response.status).toBe(401);
    });
  });

  describe("Testing limitations of flag field", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    const communityName = name.gen();
    const randomText = name.gen();

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

    describe("Sending numbers as flag", () => {
      test("Positive integer", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          0,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as flag", () => {
      test("Empty string", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          "",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as flag", () => {
      test("Null", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          null,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          { tag: tag1 },
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.setPostFlags(
          postResponse.body._id,
          [tag1, tag2],
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });
});
