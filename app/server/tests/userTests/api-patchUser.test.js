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

describe("Testing PATCH /user endpoint", () => {
  describe("Edit the information of users with /user/{name}", () => {
    const userName = name.gen();
    const userPassword = password.gen();
    let userEmail = email.gen();
    let loginResponse;
    let response;
    beforeAll(async () => {
      await auth.register(userName, email.gen(), userPassword);
      loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
      await auth.deleteUsers();
    });

    test("Edit fields by passing an object - returns 204", async () => {
      userEmail = email.gen();
      const body = {
        email: userEmail,
        firstName: "Sarah",
        lastName: "Grace",
        bio: "Hi I'm new! Just moved from the Ottawa",
        title: "Jr. Software Engineer",
        ministry: "CITZ",
        notificationFrequency: "none",
      };
      response = await user.editUserByObject(loginResponse.body.token, body);
      expect(response.status).toBe(204);
    });

    test("Confirm that those changes took effect", async () => {
      response = await user.getUser(loginResponse.body.token);
      expect(response.body.email).toBe(userEmail);
    });

    test("Try to set email to blank string value - returns 403", async () => {
      const body = {
        email: "",
      };
      response = await user.editUserByObject(loginResponse.body.token, body);
      expect(response.status).toBe(403);
    });

    test("Try to set email to invalid email - returns 403", async () => {
      const body = {
        email: "best@email@ever",
      };
      response = await user.editUserByObject(loginResponse.body.token, body);
      expect(response.status).toBe(403);
    });

    test("Try to change your name (IDIR) - returns 403", async () => {
      const body = {
        username: "test",
      };
      response = await user.editUserByObject(loginResponse.body.token, body);
      expect(response.status).toBe(403);
    });

    test("Try to edit data using a bad token - returns 401", async () => {
      const body = {
        email: "mynewemail@gmail.com",
      };
      response = await user.editUserByObject(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOWY4YTI3NDI0MDdmMWViZmUwZjVmMiIsInVzZXJuYW1lIjoiaGVscCIsImVtYWlsIjoiaGVscEBnb3YuYmMuY2EiLCJpYXQiOjE2NTQ4ODc0NjEsImV4cCI6MTY1NDg4ODA2MX0.c3eR-NaD22cLiWZKPeLg41FWWzQ1bLo29bNmMJT34aE",
        body
      );
      expect(response.status).toBe(401); // Invalid token
    });

    test("Try add a key that is not in the user model - returns 204, but is not added", async () => {
      const body = {
        favouriteDrink: "eggnog",
      };
      response = await user.editUserByObject(loginResponse.body.token, body);
      expect(response.status).toBe(204); // Handles request ok!
      response = await user.getUserByName(loginResponse.body.token, userName);
      expect(response.body.favouriteDrink).toBeFalsy(); // Not actually added
    });
  });

  describe("Testing limitations of request body field", () => {
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

    describe("Sending numbers as username", () => {
      test("Positive integer", async () => {
        const body = positiveInt.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Positive decimal", async () => {
        const body = positive.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Negative integer", async () => {
        const body = negative.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Negative decimal", async () => {
        const body = negativeInt.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Zero", async () => {
        const body = 0;
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending strings as username", () => {
      test("Empty string", async () => {
        const body = "";
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Very large string", async () => {
        const body = largeString.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("URL", async () => {
        const body = "https://github.com/bcgov/CITZ-HybridWorkplace";
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Special characters", async () => {
        const body = characters.gen();
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });
    });

    describe("Sending other things as username", () => {
      test("Null", async () => {
        const body = null;
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });

      test("Array", async () => {
        const body = [
          {
            email: "mynewemail@gmail.com",
          },
          {
            email: "mysecondemail@gmail.com",
          },
        ];
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
      });
    });
  });

  if (process.env.RUN_BREAKING_TESTS === "true") {
    describe("Testing limitations of keys within request body", () => {
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

      describe("Sending numbers as username", () => {
        test("Positive integer", async () => {
          const body = { email: positiveInt.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Positive decimal", async () => {
          const body = { email: positive.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Negative integer", async () => {
          const body = { email: negative.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Negative decimal", async () => {
          const body = { email: negativeInt.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Zero", async () => {
          const body = { email: 0 };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });
      });

      describe("Sending strings as username", () => {
        test("Empty string", async () => {
          const body = { email: "" };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Very large string", async () => {
          const body = { email: largeString.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("URL", async () => {
          const body = {
            email: "https://github.com/bcgov/CITZ-HybridWorkplace",
          };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Special characters", async () => {
          const body = { email: characters.gen() };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });
      });

      describe("Sending other things as username", () => {
        test("Null", async () => {
          const body = { email: null };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });

        test("Array", async () => {
          const body = {
            email: [
              {
                email: "mynewemail@gmail.com",
              },
              {
                email: "mysecondemail@gmail.com",
              },
            ],
          };
          response = await user.editUserByObject(
            loginResponse.body.token,
            body
          );
          expect(response.status).toBe(403);
        });
      });
    });
  }
});
