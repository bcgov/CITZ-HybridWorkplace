const { UserFunctions } = require('./userFunctions')

let users = new UserFunctions(); // build class for user actions

describe('Testing requesting of new token', () => {
    let loginResponse;
    beforeAll(async () => {
        loginResponse = await users.login('test', 'Test123!');
    });
    
    test('Requesting with refresh token returns new token - returns 200', async () => {
        let response = await users.tokenByCookie(loginResponse.body.refreshToken);
        expect(response.status).toBe(200);
    });

    test('Requesting token a second time does not return new token - should not return 200', async () => {
        let response = await users.tokenByCookie(loginResponse.body.refreshToken);
        expect(response.status).not.toBe(200);
    });

    test('Requesting token with blank cookie fails - returns 401', async () => {
        let response = await users.tokenByCookie('');
        expect(response.status).toBe(401);
    });

    test('Requesting token with null cookie fails - returns 403', async () => {
        let response = await users.tokenByCookie(null);
        expect(response.status).toBe(403);
    });

    test('Requesting token with imitated cookie fails - returns 403', async () => {
        let response = await users.tokenByCookie('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2FyYWgiLCJpYXQiOjE2NTM2ODU2OTR9.W8wMCMY-Dgq37Pc1EtguciHkn8C07wZrsChiyyJhQJI');
        expect(response.status).toBe(403);
    });
});
