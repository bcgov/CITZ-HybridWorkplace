const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

function getUser(token){
    return request.get('/user')
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

function editUser(token, name, email, first_name, last_name, bio, title, quote){
    let body = { name: name };

    if (email) body.email = email;
    if (first_name) body.first_name = first_name;
    if (last_name) body.last_name = last_name;
    if (bio) body.bio = bio;
    if (title) body.title = title;
    if (quote) body.quote = quote;

    return request.patch('/user')
        .set('accept', 'application/json')
        .set('content-type', 'application/json')
        .set('Authorization', `bearer ${ token }`)
        .send(body);
}

function getUserByName(name){
    return request.get(`/user/${ name }`)
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

function deleteUserByName(name){
    return request.delete(`/user/${ name }`)
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

module.exports = { getUser, editUser, getUserByName, deleteUserByName };