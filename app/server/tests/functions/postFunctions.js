const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

class PostFunctions{
    postList;

    constructor(){
        this.postList = [];
    }

    // Post Functions
    async createPost(title, message, community, token){
        let response = await request
            .post('/post')
            .set({authorization: `Bearer ${token}`})
            .send({"title":title, "message":message, "community":community})
        this.postList.push({
            response: response,
            token: token
        });
        return response;
    } 

    async getAllPosts(token){
        return await request
            .get(`/post`)
            .set({authorization: `Bearer ${token}`});
    } 

    async getPostById(id, token){
        return await request
            .get(`/post/${id}`)
            .set({authorization: `Bearer ${token}`});
    } 

    async editPost(id, newTitle, newMessage, newCommunity, token){
        return await request
            .patch(`/post/${id}`)
            .set({authorization: `Bearer ${token}`})
            .send({"title":newTitle, "message":newMessage, "community":newCommunity})
    } 

    async deletePost(id, token){
        return await request
            .delete(`/post/${id}`)
            .set({authorization: `Bearer ${token}`});
    }

    async deleteAllPosts(){
        for(let i = 0; i < this.postList.length; i++){
            await this.deletePost(this.postList[i].response.body._id, this.postList[i].token);
        }
    }

    async getPostsByCommunity(title, token){
        return await request
            .get(`/post/community/${title}`)
            .set({authorization: `Bearer ${token}`});
    } 

    // Post Tags Functions
    async getPostTags(id, token){
        return await request
            .get(`/post/tags/${id}`)
            .set({authorization: `Bearer ${token}`});
    } 

    async createPostTags(tags, token){
        return await request
            .post(`/post/tags/${id}`)
            .set({authorization: `Bearer ${token}`})
            .send({"tags":tags});
    } 

    async deletePostTags(token){
        return await request
            .delete(`/post/tags/${id}`)
            .set({authorization: `Bearer ${token}`});
    }

    // Post Flags Functions
    async getPostFlags(id, token){
        return await request
            .get(`/post/flags/${id}`)
            .set({authorization: `Bearer ${token}`});
    } 

    async createPostFlags(id, flag, token){
        return await request
            .post(`/post/flags/${id}`)
            .set({authorization: `Bearer ${token}`})
            .send({"flag":flag});
    } 

    async deletePostFlags(id, token){
        return await request
            .delete(`/post/flags/${id}`)
            .set({authorization: `Bearer ${token}`});
    }
}

module.exports = { PostFunctions };
