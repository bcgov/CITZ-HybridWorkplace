/*  
    Testing ability to register user accounts.
    Endpoint is /api/register
*/

const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

describe('Testing optimal inputs for register', () => {
    //name is for the IDIR input

    // Try to insert fake user if it's not already done.
    beforeAll(async () => {
        await request.post('/register')
            .send({
                "name": "Zach Galafianakis",
                "email": "zgalafianakis@gov.bc.ca",
                "password": "MyDogHasFleas1!"
            });
    });

    test('new users are registered successfully - returns 201', async () => {
        //generate random name and email
        let name = (Math.random() + 1).toString(36).substring(2);

        let response = await request.post('/register')
            .send({
                "name": `${name}`,
                "email": `${name}@gov.bc.ca`,
                "password": "MyDogHasFleas1!"
            });
        expect(response.status).toBe(201);

        let loginResponse = await request.post('/login')
        .send({
            "name": `${name}`,
            "password": "MyDogHasFleas1!"
        });

        expect(loginResponse.status).toBe(201);

        let deleteResponse = await request.delete(`/user/${name}`)
                        .set('accept', '*/*')
                        .set('Authorization', `bearer ${loginResponse.body.token}`);

        expect(deleteResponse.status).toBe(204);
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