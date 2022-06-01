const { AuthFunctions } = require('./functions/authFunctions');
const user = require('./functions/userFunctions');
const { password, name, email } = require('./functions/randomizer');

let auth = new AuthFunctions();

jest.setTimeout(10000); // Some register-login-action groups take longer than 5000ms default.

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

    test('Try to change your name (IDIR) - returns 403', async () => {
        let body = {
            "name": "test"
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).toBe(403);
    });

    // Crashed API as of 2022-06-01
    test('Try to edit data using a bad token - returns 403', async () => {
        let body = {
            "email": "mynewemail@gmail.com"
        }
        response = await user.editUserByObject('thisisasupergoodtokenthatwillmostdefinitelypass', body);
        expect(response.status).toBe(403);
    });

    test('Try add a key that is not in the user model - should not return 204', async () => {
        let body = {
            "favouriteDrink": "eggnog"
        }
        response = await user.editUserByObject(loginResponse.body.token, body);
        expect(response.status).not.toBe(204);
        response = await user.getUserByName(loginResponse.body.token, userName);
        expect(response.body.favouriteDrink).toBeFalsy();
    });
});
