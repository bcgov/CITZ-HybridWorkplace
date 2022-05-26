const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const supertest = require('supertest');
const request = supertest(endpoint);


describe('Testing sending of refresh token', () => {
    let loginResponse;
    beforeAll(async () => {
        loginResponse = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });
    });
    
    test('Sending refresh token returns new auth token - returns 200', async () => {
        let response = await request.get('/token')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);

        expect(typeof response).toBe('object');
        expect(response.status).toBe(200);
    });

    test('Sending token without authorization fails', async () => {
        let response = await request.get('/token')
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);

        expect(typeof response).toBe('object');
        expect(response.status).not.toBe(200);
    });

    test('Sending token without cookie fails - returns 401', async () => {
        let response = await request.get('/token')
            .set('Authorization', `bearer ${loginResponse.body.token}`);

        expect(typeof response).toBe('object');
        expect(response.status).toBe(401);
    });
});