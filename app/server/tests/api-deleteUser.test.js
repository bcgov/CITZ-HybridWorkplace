const { AuthFunctions } = require('./functions/authFunctions');
const user = require('./functions/userFunctions');
const { password, name, email } = require('./functions/randomizer');

let auth = new AuthFunctions();

jest.setTimeout(10000); // Some register-login-action groups take longer than 5000ms default.

describe('Delete users with /user/{name}', () => {
    let userName = name.gen();
    let userPassword = password.gen();
    let userEmail = email.gen();
    let loginResponse;
    let response; 
    beforeAll(async () => {
        await auth.register(userName, userEmail, userPassword);
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
