/*  
    Testing ability to register user accounts.
    Endpoint is /api/register
*/

const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);
const RandExp = require('randexp');
const UserFunctions = require('./userFunctions')

let user = new UserFunctions();

describe('Testing optimal inputs for register', () => {
    //name is for the IDIR input

    // Try to insert fake user if it's not already done.
    beforeAll(async () => {
        await user.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
    });

    // Clean up
    afterAll(async () => {
        await user.deleteUsers();
    });

    test('new users are registered successfully - returns 201', async () => {
        //generate random name and password 
        let name = (Math.random() + 1).toString(36).substring(2);
        let password = new RandExp(/^[\w\W]{8,}$/);

        let response = await user.register(name, name, password.gen());

        expect(response.status).toBe(201);
    });

    test('user attempts to register with name and password already used - returns 403', async () => {
        let response = await user.register('Zack Galafianakis', 'zgalafianakis@gov.bc.ca', 'MyDogHasFleas1!');
        expect(response.status).toBe(403); //user already exists
    });
});

describe('Testing sub-optimal inputs for register', () => {
    test('api rejects registration if password doesn\'t meet specifications', () => {

    });

    test('api rejects registration if email is not valid', () => {

    });
});

//TODO: test about registering with password tooo short