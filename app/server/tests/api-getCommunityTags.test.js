let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";
const welComRules = "empathy";
const welComTags = [{
    "tag": "Informative",
    "count": 1
}];

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Best",
}];



describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the get communities function after logging in
describe('Get Communities - After Login', () => {
    let response = '';
  
    beforeAll( async() => {
      response = await community.getCommunityTags(welComTitle, token);
    });
  
    test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
    });
  
    test('API returns the "Welcome" community description and title in its response body', () => {
      expect(" " + response.text+ " ").toContain(welComTags);
    });
  });
  
  describe('Creating new Community', () => {
      test('API returns a successful response - code 201', async() => {
          await community.deleteCommunity(newComTitle, token);
          response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
          expect(response.status).toBe(201);
      });
  });
  
  // Testing the get communities function after logging in
  describe('Get Communities - After Login on new community', () => {
      let response = '';
    
      beforeAll( async() => {
        response = await community.getCommunityTags(newComTitle, token);
      });
    
      test('API returns a successful response - code 200', () => {
        expect(response.status).toBe(200);
      });
    
      test('API returns the "Welcome" community description and title in its response body', () => {
        expect(" " + response.text+ " ").toContain(newComTags);
      });
  });