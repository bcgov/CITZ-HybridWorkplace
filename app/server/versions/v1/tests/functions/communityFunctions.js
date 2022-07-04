/* for swagger login tests
{
  "username": "test2",
  "password": "Tester123!"
}
*/

const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

/**
 * @description Class that contains functions for Communities.
 */
class CommunityFunctions{

   
    constructor(){
        this.communityList = [];
    }

    /************** Main Community Functions **************/

    /**
     * @description             Get all communities that user belongs to.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of Community titles.
     */
    getCommunities(token){
        return request
            .get('/community')
            .set({authorization: `Bearer ${token}`});
    } 

    /**
     * @description             Gets a specific community based on community title.
     * @param {String} title    The name of the community.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains object with community info.
     */
    getCommunitybyTitle(title, token){
        return request
            .get(`/community/${title}`)
            .set({authorization: `Bearer ${token}`});
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
    createCommunity(title, description, rules, tags, token) {

        this.communityList.push({ 
            community:   {
                        name: title,
                        creator: token
                    },
        });

        return request
            .post('/community')
            .set({authorization: `Bearer ${token}`})
            .send({'title': title, 'description': description, 'rules': rules, 'tags': tags});
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
            .set({authorization: `Bearer ${token}`});
    } 

    /**
     * @description             Removes all Communities.
     * @returns                 nothing.
     */
    deleteAllCommunities() {
        for (let i = 0; i < this.communityList.length;i++){
            this.deleteCommunity(this.communityList[i].community.name,this.communityList[i].community.creator);
        }

        return this.communityList;
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
    patchCommunitybyTitle(title, newTitle, newDescription, newRules, newTags, token) {
        return request
            .patch(`/community/${title}`)
            .set({authorization: `Bearer ${token}`})
            .send({'title': newTitle, 'description': newDescription, 'rules': newRules, 'tags': newTags});
    } 

    /************** Member Community Functions **************/

    /**
     * @description             Get all members of specified community.
     * @param {String}  title   Community title.
     * @param {boolean} count   Whether or not you want all members returned or just the number of members.
     * @param {String}  token   JWT that authenticates the user.
     * @returns                 Response from API. Body either contains an array of hashed user IDs or an object with a key "count".
     */
    getCommunityMembers(title, count, token){
        return request
            .patch(`/community/members/join/${title}`)
            .set({authorization: `Bearer ${token}`})
            .query(`count=${ count }`);
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
            .set({authorization: `Bearer ${token}`});
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
            .set({authorization: `Bearer ${token}`});
    }

    /************** Community Rules Functions **************/

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
            .set({authorization: `Bearer ${token}`})
            .send({'rules': rules});
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
            .set({authorization: `Bearer ${token}`});
    }

    /************** Community Tags Functions **************/

    /**
     * @description             Gets all tags available to a community.
     * @param {String} title    Community title. 
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of objects with tag info.
     */
    getCommunityTags(title, token) {
        return request
            .get(`/community/tags/${title}`)
            .set({authorization: `Bearer ${token}`});
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
            .set({authorization: `Bearer ${token}`})
            .query(`tag=${ tag }`);
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
            .set({authorization: `Bearer ${token}`})
            .query(`tag=${ tag }`);
    }

    /************** Community Flags Functions **************/

    /**
     * @description             Gets all flags available to a community.
     * @param {String} title    Community title.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of objects with flag info.
     */
    getCommunityFlags(title, token) {
        return request
            .get(`/community/flags/${title}`)
            .set({authorization: `Bearer ${token}`});
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
            .set({authorization: `Bearer ${token}`})
            .query(`flag=${ flag }`);
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
            .set({authorization: `Bearer ${token}`})
            .query(`flag=${ flag }`);
    }
}

module.exports = { CommunityFunctions };
