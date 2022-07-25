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

describe("Testing POST /post/tag endpoint", () => {
  let loginResponse;
  let response;
  let postResponse;
  const userName = name.gen();
  const userPassword = password.gen();
  const communityName = name.gen();
  const randomText = name.gen();
  const tag1 = "great";
  const tag2 = "not so great";

  beforeAll(async () => {
    // Set up user
    await auth.register(userName, email.gen(), userPassword);
    loginResponse = await auth.login(userName, userPassword);

    // Create some communities
    await community.createCommunity(
      communityName,
      randomText,
      randomText,
      [{ tag: tag1, count: 1 }],
      loginResponse.body.token
    );

    // Join communities
    await community.joinCommunity(communityName, loginResponse.body.token);

    // Add available tags to community
    await community.setCommunityTags(
      communityName,
      tag2,
      loginResponse.body.token
    );

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

  describe("Testing user's ability to POST Post Tags", () => {
    test("User can tag post when already defined in community tags", async () => {
      await post.setPostTags(
        postResponse.body._id,
        tag1,
        loginResponse.body.token
      );
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

    test("Trying to tag the post again with the same tag returns 403", async () => {
      response = await post.setPostTags(
        postResponse.body._id,
        tag1,
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
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

    test("After trying to add a second tag, user cannot retrieve that tag as well (AKA tag not added)", async () => {
      await post.setPostTags(
        postResponse.body._id,
        tag1,
        loginResponse.body.token
      ); // Just in case first test doesn't run
      response = await post.setPostTags(
        postResponse.body._id,
        tag2,
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
      response = await post.getPostTags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          {
            tag: tag2,
            taggedBy: expect.any(Array),
            _id: expect.any(String),
          },
        ])
      );
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

    test("User cannot add a tag to a post if it is not defined in the community", async () => {
      response = await post.setPostTags(
        postResponse.body._id,
        "Undefined Tag",
        loginResponse.body.token
      );
      expect(response.status).toBe(403);
      response = await post.getPostTags(
        postResponse.body._id,
        loginResponse.body.token
      );
      expect(response.status).toBe(200);
      expect(response.body).not.toEqual(
        expect.arrayContaining([
          {
            tag: "Undefined Tag",
            taggedBy: expect.any(Array),
            _id: expect.any(String),
          },
        ])
      );
    });

    // TODO: Currently returns 400
    test("User cannot tag post when providing a non-existant post id - returns 404", async () => {
      response = await post.setPostTags(
        "kdls;hiowkl;sdkhflw",
        "my tag",
        loginResponse.body.token
      );
      expect(response.status).toBe(404);
    });

    test("User cannot tag post when providing an invalid user token - returns 401", async () => {
      response = await post.setPostTags(
        postResponse.body._id,
        "my tag",
        "kdslfhsdfhiuwhl"
      );
      expect(response.status).toBe(401);
    });
  });

  describe("Testing limitations of tag field", () => {
    beforeAll(async () => {
      // Register user if not already done
      await auth.register(userName, email.gen(), userPassword);
      response = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    describe("Sending numbers as tag", () => {
      test("Positive integer", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          positiveInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          positive.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          negativeInt.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          negative.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          0,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as tag", () => {
      test("Empty string", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          "",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          largeString.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          characters.gen(),
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as tag", () => {
      test("Null", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          null,
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          { tag: tag1 },
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await post.setPostTags(
          postResponse.body._id,
          [tag1, tag2],
          loginResponse.body.token
        );
        expect(response.status).toBe(403);
      });
    });
  });
});
