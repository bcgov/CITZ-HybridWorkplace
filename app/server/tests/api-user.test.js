const { AuthFunctions } = require('./functions/authFunctions');
const user = require('./functions/userFunctions');
const { password, name, email } = require('./functions/randomizer');

let auth = new AuthFunctions();

describe('Get the current user\'s information with /user', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
        response = await user.getUser(loginResponse.body.token);
    });

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('User is successfully found - returns 200', () => {
        expect(response.status).toBe(200);
    });

    // This is only returning name and email, despite what Swagger suggests.
    test('Body of response is formated as expected (object with certain keys)', () => {
        expect(typeof response.body).toBe('object');
        expect(response.body.name).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        // expect(response.body.first_name).toBeTruthy();
        // expect(response.body.last_name).toBeTruthy();
        // expect(response.body.bio).toBeTruthy();
        // expect(response.body.title).toBeTruthy();
    });

    test('User info should not be returned if token does not match user - returns 403', async () => {
        response = await user.getUser('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJlbWFpbCI6InRlc3QxQGdvdi5iYy5jYSIsImZpcnN0X25hbWUiOiJTYXJhaCIsImxhc3RfbmFtZSI6IkdyYWNlIiwidGl0bGUiOiJKci4gU29mdHdhcmUgRW5naW5lZXIiLCJiaW8iOiJIaSBJJ20gbmV3ISBKdXN0IG1vdmVkIGZyb20gdGhlIE90dGF3YSIsImlhdCI6MTY1Mzk0NjQ4NiwiZXhwIjoxNjUzOTQ3MDg2fQ.V0tpcWboZG5dHEkh94gw2pNGqZj2DY7EjC42EZBdcYQ');
        expect(response.status).toBe(403);
    });
});

describe('Get the current user\'s information with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
        response = await user.getUserByName(loginResponse.body.token, userName);
    });

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('User is successfully found - returns 200', () => {
        expect(response.status).toBe(200);
    });

    // This is only returning name and email, despite what Swagger suggests.
    test('Body of response is formated as expected (object with certain keys)', () => {
        expect(typeof response.body).toBe('object');
        expect(response.body.name).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        // expect(response.body.first_name).toBeTruthy();
        // expect(response.body.last_name).toBeTruthy();
        // expect(response.body.bio).toBeTruthy();
        // expect(response.body.title).toBeTruthy();
    });
});

// This needs fixing, needs another account to get data from
describe('Get information of other users with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
        response = await user.getUserByName(loginResponse.body.token, userName);
    });

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('User is successfully found - returns 200', () => {
        expect(response.status).toBe(200);
    });

    test('Body of response is formated as expected (object with certain keys, but not all keys)', () => {
        expect(typeof response.body).toBe('object');
        expect(response.body.name).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.first_name).not.toBeTruthy();
        expect(response.body.last_name).not.toBeTruthy();
        expect(response.body.bio).not.toBeTruthy();
        expect(response.body.title).not.toBeTruthy();
    });

    //TODO: Try to get data with bad token

    //TODO: Try to get data of another user
});

describe('Edit the information of users with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let userEmail = email.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('Edit all fields at the same time - returns 204', async () => {
        response = await user.editUserByFields(
            loginResponse.body.token,
            userEmail,
            'James',
            'Smith',
            'I am a small boy from Kentucky.',
            'Modern Major General',
            'Yahoo!');
        expect(response.status).toBe(204);
    });

    test('Confirm that those changes took effect', async () => {
        let result = await user.getUser(loginResponse.body.token);
        expect(result.body.email).toBe(userEmail);
    });

    test('Edit fields by passing an object', async () => {
        userEmail = email.gen();
        let body = {
            "email": userEmail
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(204);
    });

    test('Confirm that those changes took effect', async () => {
        let result = await user.getUser(loginResponse.body.token);
        expect(result.body.email).toBe(userEmail);
    });

    //TODO: Test by passing things that arent valid

    //TODO: Test by trying to change name to name already used

    //TODO: Test by trying to change email to invalid email

    //TODO: Try to edit data with bad token

    //TODO: Try to edit data of another user
});

describe('Delete users with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let userEmail = email.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
    });

    test('User is deleted upon request', async () => {
        response = await user.deleteUserByName(loginResponse.body.token, userName);
        expect(response.statusCode).toBe(204);
    });

    //TODO: Try and delete other user.

    //TODO: Try to delete non-existant user

    //TODO: Try to delete user with bad token
});