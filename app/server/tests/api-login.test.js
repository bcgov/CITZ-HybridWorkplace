const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api/login';
const supertest = require('supertest');
const request = supertest(endpoint);

describe('Testing optimal inputs for login', () => {
    //name is for the IDIR input

    test('Test account can log in', async () => {
        let response = await request.post('/')
        .send({
            "name": "test",
            "password": "Test123!"
        });
        expect(response.status).toBe(201);
    });
});