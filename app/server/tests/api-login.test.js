const endpoint = process.env.API_REF;
const supertest = require('supertest');
const request = supertest(endpoint);

describe('Testing optimal inputs for login', () => {
    //name is for the IDIR input

    test('Test account can log in', async () => {
        let response = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });
        expect(response.status).toBe(201);
    });

    test('Token and refresh token are received upon login', async () => {
        let response = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });
        let token = response.body.token;
        let refreshToken = response.body.refreshToken;

        expect(token).toBeTruthy();
        expect(typeof token).toBe('string');
        expect(refreshToken).toBeTruthy();
        expect(typeof refreshToken).toBe('string');
    });
});

describe('Testing sub-optimal login input', () => {
    test('API refuses login with bad name credential - returns 404', async () => {
        let response = await request.post('/login')
        .send({
            "name": "notauser",
            "password": "Test123!"
        });
        expect(response.status).toBe(404);
    });

    test('API refuses login with bad password credential - returns 400', async () => {
        let response = await request.post('/login')
        .send({
            "name": "test",
            "password": "Test123@"
        });
        expect(response.status).toBe(400);
    });

    test('API refuses login with bad name and password credential - returns 404', async () => {
        let response = await request.post('/login')
        .send({
            "name": "notauser",
            "password": "Test1###"
        });
        expect(response.status).toBe(404);
    });

    test('API refuses login with empty credentials - returns 404', async () => {
        let response = await request.post('/login')
        .send({
            "name": "",
            "password": ""
        });
        expect(response.status).toBe(404);
    });
});