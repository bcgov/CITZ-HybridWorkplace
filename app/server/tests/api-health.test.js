/*  
    Testing to ensure API is running and correct response is given.
    Endpoint is /api/health
*/

const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api/health';
const supertest = require('supertest');
const request = supertest(endpoint);



describe('Testing that api exists and returns response', () => {
    test('API returns code 200', async () => {
        let response = await request.get('/');
        expect(response.ok).toBe(true);
        expect(response.status).toBe(200);
        // expect(response.body.messege).toBe('API is running!');
    });
});