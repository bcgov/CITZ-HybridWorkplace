// import {login} from './login';

const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const supertest = require('supertest');
const request = supertest(endpoint);

//import login function
// const login = require('./login');
// const loginResponse = login();

describe('Testing sending of refresh token', () => {
    test('Sending refresh token returns new auth token', async () => {
        let loginResponse = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });

        let response = await request.get('/token')
            .set('Authorization', `bearer ${loginResponse.body.token}`)
            .set('Cookie', `jwt=${loginResponse.body.refreshToken}`);
        console.log(loginResponse.headers);
        console.log(loginResponse.body);
        
        console.log(response.headers);
        console.log(response.body);
        expect(typeof response).toBe('object');
        expect(response.status).toBe(200);
    });
});