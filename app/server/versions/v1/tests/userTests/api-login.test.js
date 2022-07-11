/* eslint-disable no-undef */
const { AuthFunctions } = require("../functions/authFunctions");
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

const users = new AuthFunctions(); // build class for user actions

const userName = name.gen();
const userPassword = password.gen();
const userEmail = email.gen();
let response;

describe("Testing /login endpoint", () => {
  // Successful login is defined by both a 201 status code return and the receipt of both tokens
  describe("Testing inputs that are expected to succeed login", () => {
    beforeAll(async () => {
      // Register user if not already done
      await users.register(userName, userEmail, userPassword);
      response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
      await users.deleteUsers();
    });

    test("User can log in - returns 201", () => {
      expect(response.status).toBe(201);
    });

    test("Token is received upon login, but refreshToken is not", () => {
      const { token } = response.body;
      expect(token).toBeTruthy();
      expect(typeof token).toBe("string");

      // Refresh token is not in body
      const { refreshToken } = response.body;
      expect(refreshToken).toBeFalsy();
    });
  });

  // Failed login is defined by any other outcome other than the successful one defined above
  // Errors should throw 403: forbidden due to wrong username/password, not 401: not authorized by server. Login doesn't need auth, it gives auth.
  describe("Testing inputs that are expected to fail login", () => {
    beforeAll(async () => {
      // Register user if not already done
      await users.register(userName, userEmail, userPassword);
      response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
      await users.deleteUsers();
    });

    test("API refuses login with bad name credential - returns 403", async () => {
      response = await users.login("notauser", userPassword);
      expect(response.status).toBe(403);
    });

    test("API refuses login with bad password credential - returns 403", async () => {
      response = await users.login(userName, "Test123@");
      expect(response.status).toBe(403);
    });

    test("API refuses login with bad name and password credential - returns 403", async () => {
      response = await users.login("notauser", "Test1###");
      expect(response.status).toBe(403);
    });

    test("API refuses login with empty credentials - returns 403", async () => {
      response = await users.login("", "");
      expect(response.status).toBe(403);
    });
  });

  describe("Testing limitations of username field", () => {
    beforeAll(async () => {
      // Register user if not already done
      await users.register(userName, userEmail, userPassword);
      response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
      await users.deleteUsers();
    });

    describe("Sending numbers as username", () => {
      test("Positive integer", async () => {
        response = await users.login(positiveInt.gen(), userPassword);
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await users.login(positive.gen(), userPassword);
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await users.login(negativeInt.gen(), userPassword);
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await users.login(negative.gen(), userPassword);
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await users.login(0, userPassword);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as username", () => {
      test("Empty string", async () => {
        response = await users.login("", userPassword);
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await users.login(largeString.gen(), userPassword);
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await users.login(
          "https://github.com/bcgov/CITZ-HybridWorkplace",
          userPassword
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await users.login(characters.gen(), userPassword);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as username", () => {
      test("Null", async () => {
        response = await users.login(null, userPassword);
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await users.login({ username: `${userName}` }, userPassword);
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await users.login([userName, userName], userPassword);
        expect(response.status).toBe(403);
      });
    });
  });

  describe("Testing limitations of password field", () => {
    beforeAll(async () => {
      // Register user if not already done
      await users.register(userName, userEmail, userPassword);
      response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
      await users.deleteUsers();
    });

    describe("Sending numbers as password", () => {
      test("Positive integer", async () => {
        response = await users.login(userName, positiveInt.gen());
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        response = await users.login(userName, positive.gen());
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        response = await users.login(userName, negativeInt.gen());
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        response = await users.login(userName, negative.gen());
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        response = await users.login(userName, 0);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as password", () => {
      test("Empty string", async () => {
        response = await users.login(userName, "");
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        response = await users.login(userName, largeString.gen());
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        response = await users.login(
          userName,
          "https://github.com/bcgov/CITZ-HybridWorkplace"
        );
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        response = await users.login(userName, characters.gen());
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as password", () => {
      test("Null", async () => {
        response = await users.login(userName, null);
        expect(response.status).toBe(403);
      });

      test("JS object", async () => {
        response = await users.login(userName, { username: `${userName}` });
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        response = await users.login(userName, [userName, userName]);
        expect(response.status).toBe(403);
      });
    });
  });
});
