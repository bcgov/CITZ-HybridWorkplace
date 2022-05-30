var community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let token = '';

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Welcome to theNeighbourhood";
const welcomeCommunityRules = "string";

const newCommunityTitle = "hello";
const newCommunityDescript = "world";
const newCommunityRules = "rules";
let user = new AuthFunctions();

describe('Testing the create community function without logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,'');
  });

  afterAll(async() => {
    response = await community.deleteCommunity(newCommunityTitle,'');
  });
  
  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


describe('Logging in the test user', () => {
  test('Test account can log in', async () => {
    let response = await user.login('test','Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Testing the create community function after logging in', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,token);
  });

  afterAll(async() => {
    response = await community.deleteCommunity(newCommunityTitle,token);
  });

  test('API returns a successful response - code 201', () => {
    expect(response.status).toBe(201);
  });

  test('API returns description and title of new community', () => {
    expect('' +response.text + '').toContain(newCommunityTitle);
    expect('' +response.text + '').toContain(newCommunityDescript);
  });
});

describe('Testing the create community function after logging in, but is a duplicate community', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(welcomeCommunityTitle,welcomeCommunityDescript,welcomeCommunityRules,token);
  });
  
  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community already exists."', () => {
    expect('' + response.text + '').toContain("Community already exists.");
  });
});


describe('Testing the create community function after logging in, but without token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(newCommunityDescript,newCommunityDescript,'');
  });

  afterAll(async() => {
    response = await community.deleteCommunity(newCommunityTitle,'');
  });

  test('API will return an unsuccessful response - error code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Forbidden"', () => {
    expect(response.text).toContain("Forbidden");
  });
});


describe('Testing the create community function after logging in, but with wrong token', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(newCommunityTitle,newCommunityDescript,token + '11');
  });

  afterAll(async() => {
    response = await community.deleteCommunity(newCommunityTitle,token + '11');
  });

  test('API will return an unsuccessful response - error code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Forbidden"', () => {
    expect(response.text).toContain("Forbidden");
  });
});