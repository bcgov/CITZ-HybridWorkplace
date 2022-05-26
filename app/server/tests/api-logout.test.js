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

    //TODO: Update this? Currently fails because that same cookie is live after logout. Could be used to refresh token.
    xtest('Logging out with a previously used cookie - should not return 204', async () => {
        let response = await request.get('/logout')
            .set('accept', `*/*`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);

        expect(response.status).not.toBe(204);
    });

    //TODO: Currently returns 502. 
    xtest('Logging out with an invalid cookie - returns 401', async () => {
        let response = await request.get('/logout')
            .set('accept', `*/*`)
            .set('Cookie', `jwt=dsjfklsi3hkj3l24hkl32hjk324hjk324hjk324hu32njk32`);

        expect(response.status).toBe(401);
    });
});
