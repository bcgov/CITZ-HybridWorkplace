/* eslint-disable no-undef */
const { AuthFunctions } = require("../functions/authFunctions");
const user = require("../functions/userFunctions");
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

const auth = new AuthFunctions();

describe("Testing DELETE /user endpoint", () => {
  describe("Delete users with /user/{name}", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    const userEmail = email.gen();
    let loginResponse;
    let response;
    beforeAll(async () => {
      await auth.register(userName, userEmail, userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    test("Trying to delete a user other than yourself should be rejected - returns 403", async () => {
      await auth.register("Todd", "todd@gmail.com", "Todd123!"); // Create new user
      response = await user.deleteUserByName(loginResponse.body.token, "Todd"); // Try to delete user with original token
      expect(response.statusCode).toBe(403); // Authorized, but not allowed to do that
    });

    test("User is deleted upon request - returns 204", async () => {
      response = await user.deleteUserByName(
        loginResponse.body.token,
        userName
      );
      expect(response.statusCode).toBe(204);
    });

    test("Trying to delete a user that no longer exists should be rejected - returns 404", async () => {
      await auth.register("Josie", "josie@gmail.com", "josie123!"); // Create new user
      const tempLoginResponse = await auth.login("Josie", "josie123!"); // Log them in
      await user.deleteUserByName(tempLoginResponse.body.token, "Josie"); // Delete them
      response = await user.deleteUserByName(
        tempLoginResponse.body.token,
        "Josie"
      ); // Delete them again
      expect(response.statusCode).toBe(404); // User not found
    });

    test("Trying to delete a user with an invalid token should be rejected - returns 401", async () => {
      await auth.register("Josie", "josie@gmail.com", "josie123!"); // Create new user
      response = await user.deleteUserByName(
        "reallybadtokenimeansobadithurts",
        "Josie"
      ); // Try to delete user with bad token
      expect(response.statusCode).toBe(401); // Invalid token
    });
  });

  describe("Testing limitations of username field", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    const userEmail = email.gen();
    let response;

    // Only creating user for their token.
    beforeAll(async () => {
      await auth.register(userName, userEmail, userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    describe("Sending numbers as username", () => {
      test("Positive integer", async () => {
        await user.deleteUserByName(
          loginResponse.body.token,
          positiveInt.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        await user.deleteUserByName(loginResponse.body.token, positive.gen());
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        await user.deleteUserByName(
          loginResponse.body.token,
          negativeInt.gen()
        );
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        await user.deleteUserByName(loginResponse.body.token, negative.gen);
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        await user.deleteUserByName(loginResponse.body.token, 0);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as username", () => {
      test("Empty string", async () => {
        await user.deleteUserByName(loginResponse.body.token, "");
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        await user.deleteUserByName(
          loginResponse.body.token,
          largeString.gen()
        );
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        await user.deleteUserByName(
          loginResponse.body.token,
          "https://github.com/bcgov/CITZ-HybridWorkplace"
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        await user.deleteUserByName(loginResponse.body.token, characters.gen());
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as username", () => {
      test("Null", async () => {
        await user.deleteUserByName(loginResponse.body.token, null);
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        await user.deleteUserByName(loginResponse.body.token, {
          username: userName,
        });
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        await user.deleteUserByName(loginResponse.body.token, [
          userName,
          userName,
        ]);
        expect(response.status).toBe(403);
      });
    });
  });
});
