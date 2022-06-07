const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

function getUser(token){
    return request.get('/user')
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

function editUserByFields(token, email, firstName, lastName, bio, title){
    let body = {};

    if (email) body.email = email;
    if (firstName) body.firstName = firstName;
    if (lastName) body.lastName = lastName;
    if (bio) body.bio = bio;
    if (title) body.title = title;

    return request.patch('/user')
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .set('Authorization', `bearer ${ token }`)
        .send(body);
}

function editUserByObject(token, body){
    return request.patch('/user')
        .set('accept', '*/*')
        .set('content-type', 'application/json')
        .set('Authorization', `bearer ${ token }`)
        .send(body);
}

function getUserByName(token, username){
    return request.get(`/user/${ username }`)
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

function deleteUserByName(token, username){
    return request.delete(`/user/${ username }`)
        .set('accept', '*/*')
        .set('Authorization', `bearer ${ token }`);
}

module.exports = { getUser, editUserByFields, editUserByObject, getUserByName, deleteUserByName };
