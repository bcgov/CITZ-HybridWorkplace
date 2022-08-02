/* eslint-disable no-param-reassign */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const endpoint = process.env.API_REF;
const supertest = require("supertest");

const request = supertest(endpoint);

/**
 * @description             Returns the user's info based on the token provided.
 * @param {String} token    JWT that authenticates the user.
 * @returns                 Response from API. Body contains Object with user info.
 */
function getUser(token) {
  return request
    .get("/user")
    .set("accept", "application/json")
    .set("Authorization", `bearer ${token}`);
}

/**
 * @description          Edits fields of user. No field specifications.
 * @param {String} token JWT that authenticates the user.
 * @param {Object} body  Object that contains user key pairs.
 * @returns              Response from API.
 */
function editUserByObject(token, body) {
  if (!body.notificationFrequency) body.notificationFrequency = "none";

  return request
    .patch("/user")
    .set("accept", "*/*")
    .set("content-type", "application/json")
    .set("Authorization", `bearer ${token}`)
    .send(body);
}

/**
 * @description              Returns user information based on user specified and token provided.
 * @param {String} token     JWT that authenticates the user.
 * @param {String} username  User's username (IDIR).
 * @returns                  Response from API. Body contains Object with user info.
 */
function getUserByName(token, username) {
  return request
    .get(`/user/${username}`)
    .set("accept", "application/json")
    .set("Authorization", `bearer ${token}`);
}

/**
 * @description             Deletes user, assuming they are already logged in and provide JWT.
 * @param {String} token    JWT that authenticates the user.
 * @param {String} username User's username (IDIR).
 * @returns                 Response from API.
 */
function deleteUserByName(token, username) {
  return request
    .delete(`/user/${username}`)
    .set("accept", "*/*")
    .set("Authorization", `bearer ${token}`);
}

module.exports = {
  getUser,
  editUserByObject,
  getUserByName,
  deleteUserByName,
};
