/* eslint-disable no-undef */
const { AuthFunctions } = require("../functions/authFunctions");
const user = require("../functions/userFunctions");
const {
  password,
  name,
  email,
  positiveInt,
  negativeInt,
  negative,
  largeString,
  characters,
} = require("../functions/randomizer");

const auth = new AuthFunctions();

describe("Testing GET /user endpoint", () => {
  describe("Get the current user's information with /user", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    let loginResponse;
    let response;
    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      response = await user.getUser(loginResponse.body.token);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    test("User is successfully found - returns 200", () => {
      expect(response.status).toBe(200);
    });

    test("Body of response is formated as expected (returns only set keys)", () => {
      expect(typeof response.body).toBe("object");
      expect(response.body.username).toBeTruthy();
      expect(response.body.email).toBeTruthy();
      expect(response.body.firstName).not.toBeTruthy();
      expect(response.body.lastName).not.toBeTruthy();
      expect(response.body.bio).not.toBeTruthy();
      expect(response.body.title).not.toBeTruthy();
    });

    test("After setting all keys, they are returned by the /user endpoint", async () => {
      const body = {
        email: email.gen(),
        firstName: "newFirstName",
        lastName: "newLastName",
        bio: "new bio",
        title: "new title",
      };
      const editResponse = await user.editUserByObject(
        loginResponse.body.token,
        body
      );
      expect(editResponse.status).toBe(204);
      response = await user.getUser(loginResponse.body.token);
      expect(response.body.username).toBeTruthy();
      expect(response.body.email).toBeTruthy();
      expect(response.body.firstName).toBeTruthy();
      expect(response.body.lastName).toBeTruthy();
      expect(response.body.bio).toBeTruthy();
      expect(response.body.title).toBeTruthy();
    });

    test("User info should not be returned if token does not match user - returns 401", async () => {
      response = await user.getUser(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJlbWFpbCI6InRlc3QxQGdvdi5iYy5jYSIsImZpcnN0X25hbWUiOiJTYXJhaCIsImxhc3RfbmFtZSI6IkdyYWNlIiwidGl0bGUiOiJKci4gU29mdHdhcmUgRW5naW5lZXIiLCJiaW8iOiJIaSBJJ20gbmV3ISBKdXN0IG1vdmVkIGZyb20gdGhlIE90dGF3YSIsImlhdCI6MTY1Mzk0NjQ4NiwiZXhwIjoxNjUzOTQ3MDg2fQ.V0tpcWboZG5dHEkh94gw2pNGqZj2DY7EjC42EZBdcYQ"
      );
      expect(response.status).toBe(401); // Invalid token
    });
  });

  describe("Get the current user's information with /user/{name}", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    let loginResponse;
    let response;
    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
      response = await user.getUserByName(loginResponse.body.token, userName);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    test("User is successfully found - returns 200", () => {
      expect(response.status).toBe(200);
    });

    test("Body of response is formated as expected (returns only set keys)", () => {
      expect(typeof response.body).toBe("object");
      expect(response.body.username).toBeTruthy();
      expect(response.body.email).toBeTruthy();
      expect(response.body.firstName).not.toBeTruthy();
      expect(response.body.lastName).not.toBeTruthy();
      expect(response.body.bio).not.toBeTruthy();
      expect(response.body.title).not.toBeTruthy();
    });
  });

  describe("Get information of other users with /user/{name}", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    let loginResponse;
    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    test("Main user is logged in successfully - returns 201", () => {
      expect(loginResponse.status).toBe(201);
    });

    test("Trying to get a user with a bad token rejects the request - returns 401", async () => {
      const tempResponse = await user.getUserByName(
        "thistokenisillegitimate",
        userName
      );
      expect(tempResponse.status).toBe(401);
    });

    test("Trying to get data of another user - returns 200", async () => {
      await auth.register("Todd", "todd@gmail.com", "Todd123!"); // Create new user

      const tempResponse = await user.getUserByName(
        loginResponse.body.token,
        "Todd"
      ); // Try to get that user's info with test account's token.
      expect(tempResponse.status).toBe(200);
      expect(typeof tempResponse.body).toBe("object");
      expect(tempResponse.body.username).toBeTruthy();
      expect(tempResponse.body.email).toBeTruthy();
      expect(tempResponse.body.firstName).not.toBeTruthy();
      expect(tempResponse.body.lastName).not.toBeTruthy();
      expect(tempResponse.body.bio).not.toBeTruthy();
      expect(tempResponse.body.title).not.toBeTruthy();
    });
  });

  describe("Testing limitations on user/{userName} input", () => {
    const userName = name.gen();
    const userPassword = password.gen();

    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    describe("Sending numbers as username", () => {
      test("Positive integer", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          positiveInt.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          positive.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          negativeInt.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          negative.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await user.getUserByName(loginResponse.body.token, 0);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as username", () => {
      test("Empty string", async () => {
        response = await user.getUserByName(loginResponse.body.token, "");
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          largeString.gen()
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          "https://github.com/bcgov/CITZ-HybridWorkplace"
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await user.getUserByName(
          loginResponse.body.token,
          characters.gen()
        );
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as username", () => {
      test("Null", async () => {
        response = await user.getUserByName(loginResponse.body.token, null);
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await user.getUserByName(loginResponse.body.token, {
          username: userName,
        });
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await user.getUserByName(loginResponse.body.token, [
          userName,
          userName,
        ]);
        expect(response.status).toBe(403);
      });
    });
  });
});
