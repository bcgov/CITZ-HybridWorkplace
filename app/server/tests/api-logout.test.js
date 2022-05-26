const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const supertest = require('supertest');
const request = supertest(endpoint);


describe('Testing logout endpoint', () => {
    let loginResponse;
    beforeAll(async () => {
        loginResponse = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });
    });
    
    test('Logging out properly - returns 204', async () => {
        let response = await request.get('/logout')
            .set('accept', `*/*`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);

        expect(response.status).toBe(204);
    });

    test('Logging out without cookie - returns 401', async () => {
        let response = await request.get('/logout')
            .set('accept', `*/*`);
            
        expect(response.status).toBe(401);
    });

});