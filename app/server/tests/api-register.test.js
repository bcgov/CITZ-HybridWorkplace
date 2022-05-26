/*  
    Testing ability to register user accounts.
    Endpoint is /api/register
*/

const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const supertest = require('supertest');
const request = supertest(endpoint);

describe('Testing optimal inputs for register', () => {
    //name is for the IDIR input

    test('new users are registered successfully - returns 201', async () => {
        //generate random name and email
        let name = (Math.random() + 1).toString(36).substring(15);
        let email = (Math.random() + 1).toString(36).substring(15);

        let response = await request.post('/register')
            .send({
                "name": `"${name}"`,
                "email": `"${email}@gov.bc.ca"`,
                "password": "MyDogHasFleas1!"
            });
        expect(response.status).toBe(201);
    });

    test('user attempts to register with name and password already used - returns 403', async () => {
        let response = await request.post('/register')
            .send({
                "name": "Zach Galafianakis",
                "email": "zgalafianakis@gov.bc.ca",
                "password": "MyDogHasFleas1!"
            });
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