let { CommunityFunctions } = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Creating new Community', () => {
    test('API returns a successful response - code 201', async() => {
        await community.deleteCommunity(newComTitle, token);
        let response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
        expect(response.status).toBe(201);
    });
});

// Testing the get communities function after logging in
describe('Get Communities - After Login on new community', () => {
    let response = '';
  
    beforeAll( async() => {
      response = await community.getCommunityRules(newComTitle, token);
    });
  
    test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
    });
  
    test('API returns the "Welcome" community description and title in its response body', () => {
      expect(" " + response.text+ " ").toContain(newComRules);
    });
});


describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
    let response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });
});

describe('Set Community Rules - With Login, but community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunityRules(newComTitle, token);
  });
  
  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect('' + response.text + '').toContain("Community not found.");
  });
});
