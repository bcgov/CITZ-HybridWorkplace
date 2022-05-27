/*  
    Testing ability to register user accounts.
*/

const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);
const { UserFunctions } = require('./userFunctions')
const { password, name, email } = require('./randomizer');

let users = new UserFunctions(); // build class for user actions

describe('Testing optimal inputs for register', () => {
    // Clean up
    afterAll(async () => {
        await users.deleteUsers();
    });

    test('new users are registered successfully - returns 201', async () => {
        let response = await users.register(name.gen(), email.gen(), password.gen());
        expect(response.status).toBe(201);
    });

    test('user attempts to register with name and password already used - returns 403', async () => {
        await users.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
        let response = await users.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
        expect(response.status).toBe(403); // user already exists
    });
});

describe('Testing sub-optimal inputs for register - all return 400', () => {
    afterAll(async () => {
        await users.deleteUsers();
    });

    test('api rejects registration if password doesn\'t meet character specifications', async () => {
        let response = await users.register(name.gen(), email.gen(), 'badpasswo1!');
        expect(response.status).toBe(400);
    });

    test('api rejects registration if password doesn\'t meet number specifications', async () => {
        let response = await users.register(name.gen(), email.gen(), 'B!adpassword');
        expect(response.status).toBe(400);
    });

    test('api rejects registration if password doesn\'t meet symbol specifications', async () => {
        let response = await users.register(name.gen(), email.gen(), 'Badpassword1');
        expect(response.status).toBe(400);
    });

    test('api rejects registration if password doesn\'t meet length specifications', async () => {
        let response = await users.register(name.gen(), email.gen(), 'hi');
        expect(response.status).toBe(400);
    });

    test('api rejects registration if email is not valid', async () => {
        let response = await users.register(name.gen(), 'amazingemail', password.gen());
        expect(response.status).toBe(400);
    });
});
