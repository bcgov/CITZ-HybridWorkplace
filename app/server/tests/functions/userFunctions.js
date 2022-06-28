const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

/**
 * @description             Returns the user's info based on the token provided.
 * @param {String} token    JWT that authenticates the user.
 * @returns                 Response from API. Body contains Object with user info.
 */
function getUser(token){
    return request.get('/user')
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

/**
 * @description                 Edits fields of user, specifiying main parameters.
 * @param {String} token        JWT that authenticates the user.
 * @param {String} email        User's email address.
 * @param {String} firstName    User's first name.
 * @param {String} lastName     User's last name.
 * @param {String} bio          User's bio information.
 * @param {String} title        User's job title (e.g. CEO).
 * @returns                     Response from API.
 */
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

/**
 * @description          Edits fields of user. No field specifications.
 * @param {String} token JWT that authenticates the user.
 * @param {Object} body  Object that contains user key pairs. 
 * @returns              Response from API.
 */
function editUserByObject(token, body){
    return request.patch('/user')
        .set('accept', '*/*')
        .set('content-type', 'application/json')
        .set('Authorization', `bearer ${ token }`)
        .send(body);
}

/**
 * @description              Returns user information based on user specified and token provided.
 * @param {String} token     JWT that authenticates the user.
 * @param {String} username  User's username (IDIR).
 * @returns                  Response from API. Body contains Object with user info.
 */
function getUserByName(token, username){
    return request.get(`/user/${ username }`)
        .set('accept', 'application/json')
        .set('Authorization', `bearer ${ token }`);
}

/**
 * @description             Deletes user, assuming they are already logged in and provide JWT.
 * @param {String} token    JWT that authenticates the user.
 * @param {String} username User's username (IDIR).
 * @returns                 Response from API.
 */
function deleteUserByName(token, username){
    return request.delete(`/user/${ username }`)
        .set('accept', '*/*')
        .set('Authorization', `bearer ${ token }`);
}

module.exports = { getUser, editUserByFields, editUserByObject, getUserByName, deleteUserByName };
