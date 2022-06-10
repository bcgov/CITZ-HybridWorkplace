const { AuthFunctions } = require('../functions/authFunctions');
const { name, email, password } = require('../functions/randomizer');

let users = new AuthFunctions(); // build class for user actions

let userName = name.gen();
let userPassword = password.gen();
let userEmail = email.gen();
let response;

// Successful login is defined by both a 201 status code return and the receipt of both tokens
describe('Testing inputs that are expected to succeed login', () => {
    
    beforeAll(async () => {
        //register user if not already done
        await users.register(userName, userEmail, userPassword);
        response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
        await users.deleteUsers();
    });

    test('User can log in - returns 201', () => {
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
// Errors should throw 403: forbidden due to wrong username/password, not 401: not authorized by server. Login doesn't need auth, it gives auth.
describe('Testing inputs that are expected to fail login', () => {
    beforeAll(async () => {
        //register user if not already done
        await users.register(userName, userEmail, userPassword);
        response = await users.login(userName, userPassword);
    });

    afterAll(async () => {
        await users.deleteUsers();
    });

    test('API refuses login with bad name credential - returns 403', async () => {
        let response = await users.login('notauser', userPassword);
        expect(response.status).toBe(403);
    });

    test('API refuses login with bad password credential - returns 403', async () => {
        let response = await users.login(userName, 'Test123@');
        expect(response.status).toBe(403);
    });

    test('API refuses login with bad name and password credential - returns 403', async () => {
        let response = await users.login('notauser', 'Test1###');
        expect(response.status).toBe(403);
    });

    test('API refuses login with empty credentials - returns 403', async () => {
        let response = await users.login('', '');
        expect(response.status).toBe(403);
    });
});
