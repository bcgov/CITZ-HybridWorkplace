let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Test";

let token = '';
let user = new AuthFunctions();

// Testing the get communities function without logging in
describe('Get Communities - Without Login', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities('');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Missing token."', () => {
    expect(response.text).toBe("Missing token.");
  });
});


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test','Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the get communities function after logging in
describe('Get Communities - After Login', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities(token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community description and title in its response body', () => {
    expect(" " + response.text+ " ").toContain(welcomeCommunityDescript);
    expect(" " + response.text + " ").toContain(welcomeCommunityTitle);
  });
});


//Testing the get communities function after logging in, but without token
describe('Get Communities - After Login, without token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities('');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Missing token."', () => {
    expect(response.text).toBe("Missing token.");
  });
});


// Testing the get communities function after logging in, but with wrong token
describe('Get Communities - After Login, with modified token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunities(token + '11');
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Invalid token.");
  });
});


describe('Get Communities - After Login, with token set to null', () => {

  beforeAll(async() => {
    response = await community.getCommunities(null);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Invalid token.");
  });
});
