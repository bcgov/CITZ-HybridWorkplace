var community = require('./functions/communityFunctions.js');
var user = require('./functions/userFunctions.js');

const newCommunityTitle = "hello get";
const newCommunityDescript = "world get";

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Test";
let token = '';

describe('Testing the get community by title function with the "Welcome" community without logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle,'');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Not Authorized."', () => {
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


describe('Testing the get community by title function with the "Welcome" community after logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle,token);
  }); 

  test('API returns a successful response - code 201', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community description and title in its response body', () => {
    expect('' + response.text + '').toContain(welcomeCommunityDescript);
    expect('' + response.text + '').toContain(welcomeCommunityTitle);
  });
});


describe('Testing the get community function with the "Welcome" communityafter logging in, but without token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle,'');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


describe('Testing the get community function with the "Welcome" community after logging in, but with wrong token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle,token + '11');
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Forbidden."',() => {
    expect(response.text).toBe("Forbidden.");
  });
});
