let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";
const welComTags = "Informative";


const newComTitle = "hello get Tags";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [];



describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Get Communities Tags  - After Login', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.getCommunityTags(welComTitle, token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" tags in its response body', () => {
    expect(" " + response.text+ " ").toContain("[]");
  });
});

describe('Creating new Community', () => {
    test('API returns a successful response - code 201', async() => {
        await community.deleteCommunity(newComTitle, token);
        response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
        expect(response.status).toBe(201);
    });
});

<<<<<<< HEAD:app/server/tests/communityTests/api-getCommunityTags.test.js

=======
>>>>>>> dc6a72a97db9365e2c65ae637a303c2a44c31c08:app/server/tests/api-getCommunityTags.test.js
describe('Get Community Tags - After Login on new community', () => {
    let response = '';
  
    beforeAll( async() => {
      response = await community.getCommunityTags(newComTitle, token);
    });
  
    test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
    });
  
    test('API returns the new community tags its response body', () => {
      expect(" " + response.text+ " ").toContain("" + newComTags + "");
    });
});

describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
          response = await community.deleteCommunity(newComTitle, token);
          expect(response.status).toBe(200);
  });
});
