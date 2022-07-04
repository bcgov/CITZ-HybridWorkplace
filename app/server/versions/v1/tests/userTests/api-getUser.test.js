const { AuthFunctions } = require('../functions/authFunctions');
const user = require('../functions/userFunctions');
const { password, name, email } = require('../functions/randomizer');

let auth = new AuthFunctions();

jest.setTimeout(10000); // Some register-login-action groups take longer than 5000ms default.

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

    test('Body of response is formated as expected (returns only set keys)', () => {
        expect(typeof response.body).toBe('object');
        expect(response.body.username).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.firstName).not.toBeTruthy();
        expect(response.body.lastName).not.toBeTruthy();
        expect(response.body.bio).not.toBeTruthy();
        expect(response.body.title).not.toBeTruthy();
    });

    test('After setting all keys, they are returned by the /user endpoint', async () => {
        let body = {
            "email": email.gen(),
            "firstName": "newFirstName",
            "lastName": "newLastName",
            "bio": "new bio",
            "title": "new title"
        };
        let editResponse = await user.editUserByObject(loginResponse.body.token, body);
        expect(editResponse.status).toBe(204);
        response = await user.getUser(loginResponse.body.token);
        expect(response.body.username).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.firstName).toBeTruthy();
        expect(response.body.lastName).toBeTruthy();
        expect(response.body.bio).toBeTruthy();
        expect(response.body.title).toBeTruthy();
    });

    test('User info should not be returned if token does not match user - returns 401', async () => {
        response = await user.getUser('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdDEiLCJlbWFpbCI6InRlc3QxQGdvdi5iYy5jYSIsImZpcnN0X25hbWUiOiJTYXJhaCIsImxhc3RfbmFtZSI6IkdyYWNlIiwidGl0bGUiOiJKci4gU29mdHdhcmUgRW5naW5lZXIiLCJiaW8iOiJIaSBJJ20gbmV3ISBKdXN0IG1vdmVkIGZyb20gdGhlIE90dGF3YSIsImlhdCI6MTY1Mzk0NjQ4NiwiZXhwIjoxNjUzOTQ3MDg2fQ.V0tpcWboZG5dHEkh94gw2pNGqZj2DY7EjC42EZBdcYQ');
        expect(response.status).toBe(401); // Invalid token
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

    test('Body of response is formated as expected (returns only set keys)', () => {
        expect(typeof response.body).toBe('object');
        expect(response.body.username).toBeTruthy();
        expect(response.body.email).toBeTruthy();
        expect(response.body.firstName).not.toBeTruthy();
        expect(response.body.lastName).not.toBeTruthy();
        expect(response.body.bio).not.toBeTruthy();
        expect(response.body.title).not.toBeTruthy();
    });
});

describe('Get information of other users with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let loginResponse;
    beforeAll(async () => {
        await auth.register(userName, email.gen(), userPassword);
        loginResponse = await auth.login(userName, userPassword);
    });

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('Main user is logged in successfully - returns 201', () => {
        expect(loginResponse.status).toBe(201);
    });

    test('Trying to get a user with a bad token rejects the request - returns 401', async () => {
        let tempResponse = await user.getUserByName('thistokenisillegitimate', userName);
        expect(tempResponse.status).toBe(401);
    });

    test('Trying to get data of another user - returns 200', async () => {
        await auth.register('Todd', 'todd@gmail.com', 'Todd123!'); // Create new user

        let tempResponse = await user.getUserByName(loginResponse.body.token, 'Todd'); // Try to get that user's info with test account's token.
        expect(tempResponse.status).toBe(200);
        expect(typeof tempResponse.body).toBe('object');
        expect(tempResponse.body.username).toBeTruthy();
        expect(tempResponse.body.email).toBeTruthy();
        expect(tempResponse.body.firstName).not.toBeTruthy();
        expect(tempResponse.body.lastName).not.toBeTruthy();
        expect(tempResponse.body.bio).not.toBeTruthy();
        expect(tempResponse.body.title).not.toBeTruthy();
    });
});
