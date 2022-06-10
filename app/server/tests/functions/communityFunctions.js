/* for swagger login tests
{
  "username": "test2",
  "password": "Tester123!"
}
*/

const supertest = require('supertest');
const endpoint = process.env.API_REF;
const request = supertest(endpoint);

class CommunityFunctions{

    constructor() {
    }

    getCommunities(token){
        return request
            .get('/community')
            .set({authorization: `Bearer ${token}`});
    } 

    getCommunitybyTitle(title, token){
        return request
            .get(`/community/${title}`)
            .set({authorization: `Bearer ${token}`});
    } 

    createCommunity(title, description, rules, tags, token) {
        return request
            .post('/community')
            .set({authorization: `Bearer ${token}`})
            .send({'title': title, 'description': description, 'rules': rules, 'tags': tags});
    } 

    deleteCommunity(title, token) {
        return request
            .delete(`/community/${title}`)
            .set({authorization: `Bearer ${token}`});
    } 

    patchCommunitybyTitle(title, newTitle, newDescription, newRules, newTags, token) {
        return request
            .patch(`/community/${title}`)
            .set({authorization: `Bearer ${token}`})
            .send({'title': newTitle, 'description': newDescription, 'rules': newRules, 'tags': newTags});
    } 

    joinCommunity(title, token) {
        return request
            .patch(`/community/members/join/${title}`)
            .set({authorization: `Bearer ${token}`})
    } 

    leaveCommunity(title, token) {
        return request
            .delete(`/community/members/leave/${title}`)
            .set({authorization: `Bearer ${token}`})
    }

    setCommunityRules(title, rules, token) {
        return request
            .put(`/community/rules/${title}`)
            .set({authorization: `Bearer ${token}`})
            .send({'rules': rules});
    }

    getCommunityRules(title, token) {
        return request
            .get(`/community/rules/${title}`)
            .set({authorization: `Bearer ${token}`})
    }


    getCommunityTags(title, token) {
        return request
            .get(`/community/tags/${title}`)
            .set({authorization: `Bearer ${token}`})
    }

    setCommunityTags(title, tag, token) {
        return request
            .post(`/community/tags/${title}`)
            .set({authorization: `Bearer ${token}`})
            .query(`tag=${ tag }`);
    }

    deleteCommunityTags(title, tag, token) {
        return request
            .delete(`/community/tags/${title}`)
            .set({authorization: `Bearer ${token}`})
            .query(`tag=${ tag }`);
    }

    getCommunityFlags(title, token) {
        return request
            .get(`/community/flags/${title}`)
            .set({authorization: `Bearer ${token}`})
    }

    setCommunityFlags(title, flag, token) {
        return request
            .post(`/community/flags/${title}`)
            .set({authorization: `Bearer ${token}`})
            .query(`flag=${ flag }`);
    }

    deleteCommunityFlags(title, flag, token) {
        return request
            .delete(`/community/flags/${title}`)
            .set({authorization: `Bearer ${token}`})
            .query(`flag=${ flag }`);
    }
}

module.exports = { CommunityFunctions };
