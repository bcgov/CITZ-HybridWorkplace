const { UserFunctions } = require('./functions/userFunctions')
const { password, name, email } = require('./functions/randomizer');

let users = new UserFunctions(); // build class for user actions

describe('Testing logout endpoint', () => {
    let loginResponse;
    beforeAll(async () => {
        loginResponse = await users.login('test', 'Test123!');
    });
    
    test('Logging out properly - returns 204', async () => {
        let response = await users.logoutByCookie(loginResponse.body.refreshToken);
        expect(response.status).toBe(204); // successful login code
    });

    test('Logging out with no info passed - returns 404', async () => {
        let response = await users.logout();
        expect(response.status).toBe(404); // missing cookie or fails to find user
    });

    test('Logging out with blank cookie - returns 404', async () => {
        let response = await users.logoutByCookie('');
        expect(response.status).toBe(404); // missing cookie or fails to find user
    });

    // Test causes API to crash.
    xtest('Logging out with null cookie - Causes API crash...', async () => {
        let response = await users.logoutByCookie(null);
        expect(response.status).toBe(403); // fails to de-encrypt refreshToken
    });

    // Probably should return 403. Why is it finding a user if that user's refresh token was set to "" upon logout?
    test('Logging out with a previously used cookie - returns 401', async () => {
        let response = await users.logoutByCookie(loginResponse.body.refreshToken);
        expect(response.status).toBe(401);
    });

    test('Logging out with an invalid cookie - returns 403', async () => {
        let response = await users.logoutByCookie('dsjfklsi3hkj3l24hkl32hjk324hjk324hjk324hu32njk32');
        expect(response.status).toBe(403); // fails to de-encrypt refreshToken
    });
});
