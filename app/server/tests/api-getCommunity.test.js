require('dotenv').config();
const supertest = require('supertest');

const endpoint = process.env.REACT_APP_API_REF;
const request = supertest(endpoint);
var token = '';

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Test";


describe('Testing the get communities function without logging in', () => {

    test('API returns unsuccessful response', async () => {
      let response = await request
       .get('/community')

      expect(response.ok).toBe(false);
    });

    test('API returns code 401', async () => {
      let response = await request
        .get('/community')

      expect(response.status).toBe(401);
    });

    test('API returns description "Not Authorized."', async () => {
      let response = await request
        .get('/community')

      expect(response.text).toBe("Not Authorized.");
    });
});



describe('Testing login for test user', () => {

  test('Test account can log in', async () => {
      let response = await request
        .post('/login')
        .send({
            "name": "test",
            "password": "Test123!"
        });

      token = response.body.token;
      expect(response.status).toBe(201);
  });
});
describe('Testing the get communities function after logging in', () => {

  test('API returns successful response', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}`})

    expect(response.ok).toBe(true);
  });

  test('API returns code 200 (successful)', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}`})

    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community in its response body', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}`})

    expect(" " + response.text+ " ").toContain(welcomeCommunityDescript);
    expect(" " + response.text + " ").toContain(welcomeCommunityTitle);
  });
});
describe('Testing the get communities function after logging in, but without token', () => {

  test('API returns unsuccessful response', async () => {
    let response = await request
      .get('/community')

    expect(response.ok).toBe(false);
  });

  test('API returns code 401', async () => {
    let response = await request
      .get('/community')

    expect(response.status).toBe(401);
  });

  test('API returns description "Not Authorized."', async () => {
    let response = await request
      .get('/community')

    expect(response.text).toBe("Not Authorized.");
  });
});
describe('Testing the get communities function after logging in, but with wrong token', () => {

  test('API returns unsuccessful response', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}11`})

    expect(response.ok).toBe(false);
  });

  test('API returns code 403', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}11`})

    expect(response.status).toBe(403);
  });

  test('API returns description "Forbidden."', async () => {
    let response = await request
      .get('/community')
      .set({authorization: `Bearer ${token}11`})

    expect(response.text).toBe("Forbidden.");
  });
});

