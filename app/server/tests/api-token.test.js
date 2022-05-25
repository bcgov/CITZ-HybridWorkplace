const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api/token';
const supertest = require('supertest');
const request = supertest(endpoint);

//import login function
const loginResponse = require('./login');

describe('Testing sending of refresh token', () => {
    test('Sending refresh token returns new auth token', async () => {
        let response = await request.get('/')
            .set('Authorization', 'bearer ' + loginResponse.body.refreshToken);
    });
});