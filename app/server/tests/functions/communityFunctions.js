/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
/* eslint-disable node/no-unpublished-require */
/* eslint-disable class-methods-use-this */
/* for swagger login tests
{
  "username": "test2",
  "password": "Tester123!"
}
*/

const supertest = require("supertest");

const endpoint = process.env.API_REF;
const request = supertest(endpoint);

/**
 * @description Class that contains functions for Communities.
 */
class CommunityFunctions {
  constructor() {
    this.communityList = [];
  }

  /** ************ Main Community Functions ************* */

  /**
   * @description             Get all communities that user belongs to.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API. Body contains array of Community titles.
   */
  getCommunities(token) {
    return request.get("/community").set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description             Gets a specific community based on community title.
   * @param {String} title    The name of the community.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API. Body contains object with community info.
   */
  getCommunitybyTitle(title, token) {
    return request
      .get(`/community/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description                 Creates a community.
   * @param {String}  title       Community title.
   * @param {String}  description Text description of community.
   * @param {String}  rules       Community rules for users.
   * @param {Array}   tags        Array of objects containing tag info.
   * @param {String}  token       JWT that authenticates the user.
   * @returns                     Response from API. Body contains object with community info.
   */
  createCommunity(title, description, token, rules = [], tags = []) {
    this.communityList.push({
      community: {
        name: title,
        creator: token,
      },
    });

    return request
      .post("/community")
      .set({ authorization: `Bearer ${token}` })
      .send({
        title,
        description,
        rules,
        tags,
      });
  }

  /**
   * @description             Deletes community based on title and user authentication.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  deleteCommunity(title, token) {
    return request
      .delete(`/community/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description             Removes all Communities.
   * @returns                 nothing.
   */
  deleteAllCommunities() {
    if (process.env.CLEANUP === "true") {
      for (let i = 0; i < this.communityList.length; i++) {
        this.deleteCommunity(
          this.communityList[i].community.name,
          this.communityList[i].community.creator
        );
      }

      return this.communityList;
    }
  }

  /**
   * @description                     Edits existing community.
   * @param {String}  title           Original community title.
   * @param {String}  newTitle        New community title.
   * @param {String}  newDescription  New community description.
   * @param {String}  newRules        New community rules.
   * @param {Array}   newTags         New community tags. An array of objects with tag info.
   * @param {String}  token           JWT that authenticates the user.
   * @returns                         Response from API.
   */
  patchCommunitybyTitle(title, newTitle, newDescription, newRules, token) {
    return request
      .patch(`/community/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        title: newTitle,
        description: newDescription,
        rules: newRules,
      });
  }

  /** ************ Member Community Functions ************* */

  /**
   * @description             Get all members of specified community.
   * @param {String}  title   Community title.
   * @param {boolean} count   Whether or not you want all members returned or just the number of members.
   * @param {String}  token   JWT that authenticates the user.
   * @returns                 Response from API. Body either contains an array of hashed user IDs or an object with a key "count".
   */
  getCommunityMembers(title, count, token) {
    return request
      .get(`/community/members/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`count=${count}`);
  }

  /**
   * @description             Adds user to community's list of members.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  joinCommunity(title, token) {
    return request
      .patch(`/community/members/join/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description             Removes user from community's list of members.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  leaveCommunity(title, token) {
    return request
      .delete(`/community/members/leave/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /** ************ Community Rules Functions ************* */

  /**
   * @description             Edits the rules of a community.
   * @param {String} title    Community title.
   * @param {String} rules    Rules for the community's users.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  setCommunityRules(title, rules, token) {
    return request
      .put(`/community/rules/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ rules });
  }

  /**
   * @description             Gets the rules of a community.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API. Body contains object with 'rules' key.
   */
  getCommunityRules(title, token) {
    return request
      .get(`/community/rules/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /** ************ Community Tags Functions ************* */

  /**
   * @description             Gets all tags available to a community.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API. Body contains array of objects with tag info.
   */
  getCommunityTags(title, token) {
    return request
      .get(`/community/tags/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description             Adds a tag to the list of a community's available tags.
   * @param {String} title    Community title.
   * @param {String} tag      New tag to add.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  setCommunityTags(title, tag, token) {
    return request
      .post(`/community/tags/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send(tag);
  }

  /**
   * @description             Removes tag from list of a community's available tags.
   * @param {String} title    Community title.
   * @param {String} tag      Tag to be removed.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  deleteCommunityTags(title, tag, token) {
    return request
      .delete(`/community/tags/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`tag=${tag}`);
  }

  /** ************ Community Flags Functions ************* */

  /**
   * @description             Gets all flags available to a community.
   * @param {String} title    Community title.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API. Body contains array of objects with flag info.
   */
  getCommunityFlags(title, token) {
    return request
      .get(`/community/flags/${title}`)
      .set({ authorization: `Bearer ${token}` });
  }

  /**
   * @description             Adds additional flag to list of available flags.
   * @param {String} title    Community title.
   * @param {String} flag     New flag to be added.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  setCommunityFlags(title, flag, token) {
    return request
      .post(`/community/flags/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`flag=${flag}`);
  }

  /**
   * @description             Removes flag from list of available flags.
   * @param {String} title    Community title.
   * @param {String} flag     Flag to be removed.
   * @param {String} token    JWT that authenticates the user.
   * @returns                 Response from API.
   */
  deleteCommunityFlags(title, flag, token) {
    return request
      .delete(`/community/flags/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`flag=${flag}`);
  }

  /* ***************** Community Moderation Functions ************** */

  /**
   * @description             Gets a list of moderators from a chosen community.
   * @param {String}  title   Community title.
   * @param {String}  token   JWT that authenticates the user.
   * @param {boolean} count   Whether it should return only a count of moderators, not the list.
   * @returns                 Response containing list of users.
   */
  getModerators(title, token, count = false) {
    return request
      .get(`/community/moderators/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .query(`count=${count}`);
  }

  /**
   * @description                   Adds user to moderator list.
   * @param {String}  title         Community title.
   * @param {String}  username      Username of targeted user.
   * @param {Array}   permissions   Array of strings that correspond to permissions.
   * @param {String}  token         JWT that authenticates the user.
   * @returns                       Response from API.
   */
  addModerator(title, username, permissions, token) {
    return request
      .patch(`/community/moderators/add/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ username, permissions });
  }

  /**
   * @description               Removes user from moderator list.
   * @param {String} title      Community title.
   * @param {String} username   Username of targeted user.
   * @param {String} token      JWT that authenticates the user.
   * @returns                   Response from API.
   */
  removeModerator(title, username, token) {
    return request
      .delete(`/community/moderators/remove/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ username });
  }

  /**
   * @description                   Edits existing moderator's permissions.
   * @param {String}  title         Community title.
   * @param {String}  username      Username of targeted user.
   * @param {Array}   permissions   Array of strings that correspond to permissions.
   * @param {String}  token         JWT that authenticates the user.
   * @returns                       Response from API.
   */
  setModPermissions(title, username, permissions, token) {
    return request
      .patch(`/community/moderators/permissions/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ username, permissions });
  }

  /**
   * @description               Kicks user from community, preventing them from rejoining.
   * @param {String} title      Community title.
   * @param {String} username   Username of targeted user.
   * @param {String} period     Period of time user is kicked for (hour, day, week, forever, test)
   * @param {String} token      JWT that authenticates the user.
   * @returns                   Response from API.
   */
  kickUser(title, username, period, token) {
    return request
      .post(`/community/moderators/kick/${title}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ username, period });
  }
}

module.exports = { CommunityFunctions };
