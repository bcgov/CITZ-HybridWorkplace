const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

// Post Functions
function createPost(title, message, community, token){
    return request
        .post('/post')
        .set({authorization: `Bearer ${token}`})
        .send({"title":title, "message":message, "community":community})
} 

function getAllPosts(token){
    return request
        .get(`/post`)
        .set({authorization: `Bearer ${token}`});
} 

function getPostsById(id, token){
    return request
        .get(`/post/${id}`)
        .set({authorization: `Bearer ${token}`});
} 

function editPost(id, newTitle, newMessage, newCommunity, token){
    return request
        .patch(`/post/${id}`)
        .set({authorization: `Bearer ${token}`})
        .send({"title":newTitle, "message":newMessage, "community":newCommunity})
} 

function deletePost(token){
    return request
        .delete(`/post/${id}`)
        .set({authorization: `Bearer ${token}`});
}

function getPostsByCommunity(title, token){
    return request
        .get(`/post/community/${title}`)
        .set({authorization: `Bearer ${token}`});
} 

// Post Tags Functions

function getPostTags(id, token){
    return request
        .get(`/post/tags/${id}`)
        .set({authorization: `Bearer ${token}`});
} 

function createPostTags(tags, token){
    return request
        .post(`/post/tags/${id}`)
        .set({authorization: `Bearer ${token}`})
        .send({"tags":tags});
} 

function deletePostTags(token){
    return request
        .delete(`/post/tags/${id}`)
        .set({authorization: `Bearer ${token}`});
}

// Post Flags Functions
function getPostFlags(id, token){
    return request
        .get(`/post/flags/${id}`)
        .set({authorization: `Bearer ${token}`});
} 

function createPostFlags(id, flag, token){
    return request
        .post(`/post/flags/${id}`)
        .set({authorization: `Bearer ${token}`})
        .send({"flag":flag});
} 

function deletePostFlags(id, token){
    return request
        .delete(`/post/flags/${id}`)
        .set({authorization: `Bearer ${token}`});
}


module.exports = {createPost, getAllPosts, getPostsById, editPost, deletePost, getPostsByCommunity, 
    getPostTags, createPostTags, deletePostTags, getPostFlags, createPostFlags, deletePostFlags};
