const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

function getCommunities(token){
    return request
        .get('/community')
        .set({authorization: `Bearer ${token}`});
} 

function getCommunitybyTitle(title, token){
    return request
        .get(`/community/${title}`)
        .set({authorization: `Bearer ${token}`});
} 

function createCommunity(title, description, rules, tags, token) {
    return request
        .post('/community')
        .set({authorization: `Bearer ${token}`})
        .send({'title': title, 'description': description, 'rules': rules, 'tags': tags});
} 

function deleteCommunity(title, token) {
    return request
        .delete(`/community/${title}`)
        .set({authorization: `Bearer ${token}`});
} 

function patchCommunitybyTitle(title, newTitle, newDescription, newRules, newTags, token) {
    return request
        .patch(`/community/${title}`)
        .set({authorization: `Bearer ${token}`})
        .query({'tag': newTags})
        .send({'title': newTitle, 'description': newDescription, 'rules': newRules});
} 

function joinCommunity(title, token) {
    return request
        .patch(`/community/members/join/${title}`)
        .set({authorization: `Bearer ${token}`})
} 

function leaveCommunity(title, token) {
    return request
        .delete(`/community/members/leave/${title}`)
        .set({authorization: `Bearer ${token}`})
}

function setCommunityRules(title,rules,token) {
    return request
        .put(`/community/rules/${title}`)
        .set({authorization: `Bearer ${token}`})
        .send({'rules': rules});
}

function getCommunityRules(title, token) {
    return request
        .get(`/community/rules/${title}`)
        .set({authorization: `Bearer ${token}`})
}

function getCommunityTags(title, token) {
    return request
        .get(`/community/tags/${title}`)
        .set({authorization: `Bearer ${token}`})
}

function setCommunityTags(title, tags, token) {
    return request
        .post(`/community/tags/${title}`)
        .set({authorization: `Bearer ${token}`})
        .query({'tag': tags});
}

function deleteCommunityTags(title, tags, token) {
    return request
        .delete(`/community/tags/${title}`)
        .set({authorization: `Bearer ${token}`})
        .query({'tag': tags});
}

module.exports = {getCommunities, getCommunitybyTitle,createCommunity,deleteCommunity,
    patchCommunitybyTitle,joinCommunity, leaveCommunity, setCommunityRules, getCommunityRules,
    setCommunityTags, getCommunityTags, deleteCommunityTags };
    
