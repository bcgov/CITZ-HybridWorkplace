let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";

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


describe('Get Communities Flags  - After Login', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.getCommunityFlags(welComTitle, token);
    });

    test('API returns a successful response - code 200', () => {
        expect(response.status).toBe(200);
    });

    test('API returns the "Welcome" tags in its response body', () => {
        expect(" " + response.text+ " ").toContain("[]");
    });
});
