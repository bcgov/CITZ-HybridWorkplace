var community = require('./functions/communityFunctions.js');
var user = require('./functions/userFunctions.js');

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Test";
let token = '';

describe('Testing the get communities function without logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities('');
  });

  test('API returns code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


describe('Testing login for test user', () => {

  test('Test account can log in', async () => {
    let response = await user.loginUser('test','Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Testing the get communities function after logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities(token);
  });

  test('API returns successful response', () => {
    expect(response.ok).toBe(true);
  });

  test('API returns code 200 (successful)', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community in its response body', () => {
    expect(" " + response.text+ " ").toContain(welcomeCommunityDescript);
    expect(" " + response.text + " ").toContain(welcomeCommunityTitle);
  });
});


describe('Testing the get communities function after logging in, but without token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities('');
  });

  test('API returns unsuccessful response', () => {
    expect(response.ok).toBe(false);
  });

  test('API returns code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


describe('Testing the get communities function after logging in, but with wrong token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities(token + '11');
  });

  test('API returns unsuccessful response', () => {
    expect(response.ok).toBe(false);
  });

  test('API returns code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description "Forbidden."', () => {
    expect(response.text).toBe("Forbidden.");
  });
});
