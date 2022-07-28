const endpoint = process.env.API_REF;
const supertest = require("supertest");
const request = supertest(endpoint);

/**
 * @description Class that contains functions for authorization actions
 */

class AuthFunctions {
  registerList; // Tracks registered users for later clean up.

  constructor() {
    this.registerList = [];
  }

  /**
   * @description             Registers a user. Adds this new user to registerList for later clean up.
   * @param {String} name     Username. Will represent IDIR when implemented fully.
   * @param {String} email    Standard email address.
   * @param {String} password User's chosen password.
   * @returns                 Response from API.
   */
  async register(name, email, password) {
    let registerResponse = await request
      .post("/register")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        username: name,
        email: email,
        password: password,
      });
    if (registerResponse.status == 201) {
      this.registerList.push({
        user: {
          name: name,
          email: email,
          password: password,
        },
        response: registerResponse,
      });
    }

    return registerResponse;
  }

  /**
   * @description Deletes any users registered in this instance of AuthFunctions.
   */
  // This is causing significant hangups with the API because of how it handles certain inputs.
  // Commenting out for now to speed up API tests.
  // Should not affect test runners, as collections are cleared each run.
  async deleteUsers() {
    if (process.env.CLEANUP === "true") {
      for (let i = 0; i < this.registerList.length; i++) {
        await this.delete(
          this.registerList[i].user.name,
          this.registerList[i].user.password
        );
      }
      this.registerList = [];
    }
  }

  /**
   * @description             Logs an existing user in.
   * @param {String} name     User's name (IDIR).
   * @param {String} password User's password.
   * @returns                 Response from API with following body: {"token": "string"}
   */
  async login(name, password) {
    let loginResponse = await request
      .post("/login")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        username: name,
        password: password,
      });
    return loginResponse;
  }

  /**
   * @description             Logs in user to get their token, then uses token to delete user.
   * @param {String} name     User's name (IDIR).
   * @param {String} password User's password.
   * @returns                 Response from API.
   */
  async delete(name, password) {
    let loginResponse = await this.login(name, password);

    let deleteResponse = await request
      .delete(`/user/${name}`)
      .set("accept", "*/*")
      .set("Authorization", `bearer ${loginResponse.body.token}`);
    return deleteResponse;
  }

  // TODO: Logs out an existing user - needs update
  async logout(name, password) {
    let loginResponse = await this.login(name, password);
    let logoutResponse = await request
      .get("/logout")
      .set("accept", `*/*`)
      .set("Cookie", `jwt=${loginResponse.body.refreshToken}`);
    return logoutResponse;
  }

  // TODO: Retrieves a new token for an existing user - needs update
  async token(name, password) {
    let loginResponse = await this.login(name, password);
    let tokenResponse = await request
      .get("/token")
      .set("Authorization", `bearer ${loginResponse.body.token}`)
      .set("Cookie", `jwt=${loginResponse.body.refreshToken}`);
    return tokenResponse;
  }
}

module.exports = { AuthFunctions };
