/*  
    Testing ability to register user accounts.
    Endpoint is /api/register
*/

const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api/register';
const supertest = require('supertest');
const request = supertest(endpoint);

describe('Testing expected outputs for register', () => {
    //name is for the IDIR input
    test('API returns 403 when user already exists', async () => {
        let response = await request.post('/')
            .send({
                "name": "Zach Galafianakis",
                "email": "zgalafianakis@gov.bc.ca",
                "password": "MyDogHasFleas1!"
            });
        expect(response.status).toBe(403); //user already exists
    });
});