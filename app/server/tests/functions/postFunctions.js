require('dotenv').config();
const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);


function createPost(token){
    return request
        .post('/post')
        .set({authorization: `Bearer ${token}`});
} 

function getAllPosts(token){
    return request
        .get(`/post`)
        .set({authorization: `Bearer ${token}`});
} 

function getPost(id,token){
    return request
        .get(`/post/${id}`)
        .set({authorization: `Bearer ${token}`});
} 

function editPost(newTitle,newDescript,token){
    return request
        .patch(`/post/${id}`)
        .set({authorization: `Bearer ${token}`})
        .send({'title': newTitle, 'description': newDescript,}); 
} 

function deletePost(token){
    return request
        .delete(`/post/${id}`)
        .set({authorization: `Bearer ${token}`});
}

module.exports = {createPost,getAllPosts,getPost,editPost,deletePost};
