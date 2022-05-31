const { AuthFunctions } = require('./functions/authFunctions')

let users = new AuthFunctions(); // build class for user actions

// Successful login is defined by both a 201 status code return and the receipt of both tokens
describe('Testing inputs that are expected to succeed login', () => {
    let response;

    beforeAll(async () => {
        //register user if not already done
        await users.register('test', 'test@gov.bc.ca', 'Test123!');
        response = await users.login('test', 'Test123!');
    });

    test('Test account can log in - returns 201', () => {
        expect(response.status).toBe(201);
    });

    test('Token is received upon login, but refreshToken is not', () => {
        let token = response.body.token;
        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');

        // Refresh token is not in body
        let refreshToken = response.body.refreshToken;
        expect(refreshToken).toBeFalsy();
    });
});

// Failed login is defined by any other outcome other than the successful one defined above
describe('Testing inputs that are expected to fail login', () => {
    test('API refuses login with bad name credential - returns 404', async () => {
        let response = await users.login('notauser', 'Test123!');
        expect(response.status).toBe(404);
    });

    test('API refuses login with bad password credential - returns 400', async () => {
        let response = await users.login('test', 'Test123@');
        expect(response.status).toBe(400);
    });

    test('API refuses login with bad name and password credential - returns 404', async () => {
        let response = await users.login('notauser', 'Test1###');
        expect(response.status).toBe(404);
    });

    test('API refuses login with empty credentials - returns 404', async () => {
        let response = await users.login('', '');
        expect(response.status).toBe(404);
    });
});
