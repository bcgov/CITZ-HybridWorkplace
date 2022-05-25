const endpoint = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api/login';
const supertest = require('supertest');
const request = supertest(endpoint);

async function login(){
    let response = await request.post('/')
        .send({
            "name": "test",
            "password": "Test123!"
        });
    return response;
}

module.exports = { login };