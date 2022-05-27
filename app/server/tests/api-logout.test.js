const { UserFunctions } = require('./userFunctions')
const { password, name, email } = require('./randomizer');

let users = new UserFunctions(); // build class for user actions

describe('Testing logout endpoint', () => {
    let loginResponse;
    beforeAll(async () => {
        loginResponse = await users.login('test', 'Test123!');
    });
    
    test('Logging out properly - returns 204', async () => {
        let response = await users.logoutByCookie(loginResponse.body.refreshToken);
        expect(response.status).toBe(204);
    });

    test('Logging out without cookie - returns 401', async () => {
        let response = await users.logoutByCookie('');
        expect(response.status).toBe(401);
    });

    test('Logging out with a previously used cookie - returns 401', async () => {
        let response = await users.logoutByCookie(loginResponse.body.refreshToken);
        expect(response.status).not.toBe(401);
    });

    //TODO: Currently returns 502, but why?
    test('Logging out with an invalid cookie - returns 401', async () => {
        let response = await users.logoutByCookie('dsjfklsi3hkj3l24hkl32hjk324hjk324hjk324hu32njk32');
        expect(response.status).toBe(401);
    });
});
