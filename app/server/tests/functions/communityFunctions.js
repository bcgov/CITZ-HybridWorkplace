require('dotenv').config();
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

function createCommunity(title, description, rules, token){
    return request
        .post('/community')
        .set({authorization: `Bearer ${token}`})
        .send({'title': title, 'description': description, 'rules': rules});
} 

function deleteCommunity(title, token){
    return request
        .delete(`/community/${title}`)
        .set({authorization: `Bearer ${token}`});
} 

function patchCommunitybyTitle(title, newTitle, newDescription, newRules, token){
    return request
        .patch(`/community/${title}`)
        .set({authorization: `Bearer ${token}`})
        .send({'title': newTitle, 'description': newDescription, 'rules': newRules});
} 

function joinCommunitybyTitle(title, token){
    return request
        .patch(`/community/join/${title}`)
        .set({authorization: `Bearer ${token}`})
} 

function leaveCommunitybyTitle(title, token){
    return request
        .delete(`/community/leave/${title}`)
        .set({authorization: `Bearer ${token}`})
}

function setRulesForCommunity(title,rules,token){
    return request
        .put(`/community/rules/${title}`)
        .set({authorization: `Bearer ${token}`})
        .send({'rules': newTitle});
}

function getRulesForCommunity(title,token){
    return request
        .get(`/community/rules/${title}`)
        .set({authorization: `Bearer ${token}`})
}

module.exports = {getCommunities, getCommunitybyTitle,createCommunity,deleteCommunity,
    patchCommunitybyTitle,joinCommunitybyTitle,leaveCommunitybyTitle,setRulesForCommunity,
    getRulesForCommunity };