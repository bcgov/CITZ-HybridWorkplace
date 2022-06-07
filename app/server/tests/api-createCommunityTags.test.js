let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";

const newComTitle = "hello create";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];;
const updatedTags = "new";


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the get communities function after logging in
describe('Get Communities Tags - After Login', () => {
    let response = '';
  
    beforeAll( async() => {
      response = await community.getCommunityTags(welComTitle, token);
    });
  
    test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
    });
  
    test('API returns the "Welcome" community description and title in its response body', () => {
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

// Testing the get communities function after logging in
describe('Set Communities tags - After Login on new community', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.setCommunityTags(newComTitle, updatedTags, token);
    });

    test('API returns a successful response - code 204', () => {
        expect(response.status).toBe(204);
    });

    test('API returns the "Welcome" community tags in its response body', () => {
        expect(" " + response.text + " ").toContain(updatedTags);
    });
});

describe('Get Community by Title - With Login, testing with new " " Community', () => {
    let response = '';
  
    beforeAll(async() => {
      response = await community.getCommunitybyTitle(newComTitle, token);
    });
  
    test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
    });
  
    test('API returns description -  includes new community Title',() => {
      expect('' + response.text + '').toContain(updatedTags);
    });
  });
  


describe('Deleting new Community', () => {
    test('API returns a successful response - code 200', async() => {
            response = await community.deleteCommunity(newComTitle, token);
            expect(response.status).toBe(200);
    });
});