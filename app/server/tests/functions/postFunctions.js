const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

/**
 * @description Class containing functions to address Post creation, deletion, etc.
 */
class PostFunctions{
    postList;

    constructor(){
        this.postList = [];
    }

    /************** Post Functions **************/

    /**
     * @description                 Creates post on specified community. Adds post to list for later deletion.
     * @param {String} title        Title of post.
     * @param {String} message      Content of post.
     * @param {String} community    Name of community where post is going.
     * @param {String} token        JWT that authenticates the user.
     * @returns                     Response from API. Body contains Object with post info.
     */
    async createPost(title, message, community, token){
        let response = await request
            .post('/post')
            .set({authorization: `Bearer ${ token }`})
            .send({"title":title, "message":message, "community":community});
        if (response.status == 201){
            this.postList.push({
                response: response,
                token: token
            });
        }
        return response;
    } 

    /**
     * @description             Gets all posts from communities user is a part of.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of post ID strings.
     */
    async getAllPosts(token){
        return await request
            .get(`/post`)
            .set({authorization: `Bearer ${ token }`});
    } 

    /**
     * @description             Gets a single post, based on the post ID provided. 
     * @param {String} id       Post ID.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains an object with post info.
     */
    async getPostById(id, token){
        return await request
            .get(`/post/${ id }`)
            .set({authorization: `Bearer ${ token }`});
    } 

    /**
     * @description                 Edits a post based on post ID and JWT provided.
     * @param {String}  id          Post ID.
     * @param {String}  newTitle    Updated title for post.
     * @param {String}  newMessage  Updated message for post.
     * @param {boolean} pinned      Determines whether post if pinned to community.
     * @param {String}  token       JWT that authenticates the user.
     * @returns                     Response from API.
     */
    async editPost(id, newTitle, newMessage, pinned, token){
        return await request
            .patch(`/post/${ id }`)
            .set({authorization: `Bearer ${ token }`})
            .send({"title":newTitle, "message":newMessage, "pinned": pinned})
    } 

    /**
     * @description             Deletes a post based on post ID and JWT provided.
     * @param {String} id       Post ID.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API.
     */
    async deletePost(id, token){
        return await request
            .delete(`/post/${ id }`)
            .set({authorization: `Bearer ${ token }`});
    }

    /**
     * @description Deletes all posts stored in the postList array.
     */
    async deleteAllPosts(){
        for(let i = 0; i < this.postList.length; i++){
            await this.deletePost(this.postList[i].response.body._id, this.postList[i].token);
        }
    }

    /**
     * @description             Gets all posts based on community provided.
     * @param {String} title    Community title/name.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of objects with post info. 
     */
    async getPostsByCommunity(title, token){
        return await request
            .get(`/post/community/${ title }`)
            .set({authorization: `Bearer ${ token }`});
    } 

    /************** Post Tags Functions **************/

    /**
     * @description             Gets all tags on a post specified by post ID.
     * @param {String} id       Post ID.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of objects with tag info.
     */
    async getPostTags(id, token){
        return await request
            .get(`/post/tags/${ id }`)
            .set({authorization: `Bearer ${ token }`});
    } 

    /**
     * @description             Applies a tag to a post.
     * @param {String} id       Post ID.
     * @param {String} tag      Tag to be applied to post. Must match community-allowed tags.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. 
     */
    async setPostTags(id, tag, token){
        return await request
            .post(`/post/tags/${ id }`)
            .set({authorization: `Bearer ${ token }`})
            .query(`tag=${ tag }`);
    } 

    /**
     * @description             Removes a tag from a post, based on post ID and user token.
     * @param {String} id       Post ID.
     * @param {String} token    JWT that authenticates the user. Used to determine which tag to remove.
     * @returns                 Response from API. 
     */
    async deletePostTags(id, token){
        return await request
            .delete(`/post/tags/${ id }`)
            .set({authorization: `Bearer ${ token }`});
    }

    /************** Post Flags Functions **************/

    /**
     * @description             Gets all flags on specific post.
     * @param {String} id       Post ID.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API. Body contains array of objects with flag info.
     */
    async getPostFlags(id, token){
        return await request
            .get(`/post/flags/${ id }`)
            .set({authorization: `Bearer ${ token }`});
    } 

    /**
     * @description             Assigns a flag on a post.
     * @param {String} id       Post ID.
     * @param {String} flag     Flag. Must be available from community flags.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API.
     */
    async setPostFlags(id, flag, token){
        return await request
            .post(`/post/flags/${ id }`)
            .set({authorization: `Bearer ${ token }`})
            .query(`flag=${ flag }`);
    } 

    /**
     * @description             Removes flag from post.
     * @param {String} id       Post ID.
     * @param {String} flag     Post flag to remove.
     * @param {String} token    JWT that authenticates the user.
     * @returns                 Response from API.
     */
    async deletePostFlags(id, flag, token){
        return await request
            .delete(`/post/flags/${ id }`)
            .set({authorization: `Bearer ${ token }`})
            .query(`flag=${ flag }`);
    }
}

module.exports = { PostFunctions };
