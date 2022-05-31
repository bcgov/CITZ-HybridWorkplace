const { AuthFunctions } = require('./functions/authFunctions');
const user = require('./functions/userFunctions');
const { password, name, email } = require('./functions/randomizer');

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

    test('Trying to get a user with a bad token rejects the request - returns 403', async () => {
        let tempResponse = await user.getUserByName('thistokenisillegitimate', userName);
        expect(tempResponse.status).toBe(403);
    });

    test('Trying to get data of another user should only return name and email', async () => {
        await auth.register('Todd', 'todd@gmail.com', 'Todd123!'); // Create new user
        let tempResponse = await user.getUserByName(loginResponse.body.token, 'Todd'); // Try to get that user's info with test account's token.
        expect(tempResponse.status).toBe(200);
        expect(typeof tempResponse.body).toBe('object');
        expect(tempResponse.body.name).toBeTruthy();
        expect(tempResponse.body.email).toBeTruthy();
        expect(tempResponse.body.first_name).not.toBeTruthy();
        expect(tempResponse.body.last_name).not.toBeTruthy();
        expect(tempResponse.body.bio).not.toBeTruthy();
        expect(tempResponse.body.title).not.toBeTruthy();
    });
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

    test('Edit fields by passing an object - returns 204', async () => {
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

    test('Try to set email to blank string value - should not return 204', async () => {
        let body = {
            "email": ""
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).not.toBe(204);
    });

    test('Try to set email to invalid email - should not return 204', async () => {
        let body = {
            "email": "best@email@ever"
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).not.toBe(204);
    });

    test('Try to set name to the name of another user - returns 400', async () => {
        let body = {
            "name": "test"
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(400);
    });

    test('Try to edit data using a bad token - returns 403', async () => {
        let body = {
            "email": "mynewemail@gmail.com"
        }
        response = await user.editUserByObject('thisisasupergoodtokenthatwillmostdefinitelypass', body);
        expect(response.status).toBe(403);
    });
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

    afterAll(async () => {
        await auth.deleteUsers();
    });

    test('Trying to delete a user other than yourself should be rejected - returns 401', async () => {
        await auth.register('Todd', 'todd@gmail.com', 'Todd123!'); // Create new user
        response = await user.deleteUserByName(loginResponse.body.token, 'Todd');
        expect(response.statusCode).toBe(401); // Not authorized
    });

    test('User is deleted upon request - returns 204', async () => {
        response = await user.deleteUserByName(loginResponse.body.token, userName);
        expect(response.statusCode).toBe(204);
    });

    test('Trying to delete a user that no longer exists should be rejected - returns 404', async () => {
        await auth.register('Josie', 'josie@gmail.com', 'josie123!'); // Create new user
        let tempLoginResponse = await auth.login('Josie', 'josie123!'); // Log them in
        await user.deleteUserByName(tempLoginResponse.body.token, 'Josie'); // Delete them
        response = await user.deleteUserByName(tempLoginResponse.body.token, 'Josie'); // Delete them again
        expect(response.statusCode).toBe(404); // User not found
    });

    test('Trying to delete a user with an invalid token should be rejected - returns 403', async () => {
        await auth.register('Josie', 'josie@gmail.com', 'josie123!'); // Create new user
        response = await user.deleteUserByName('reallybadtokenimeansobadithurts', 'Josie');
        expect(response.statusCode).toBe(403); // Forbidden
    });
});
