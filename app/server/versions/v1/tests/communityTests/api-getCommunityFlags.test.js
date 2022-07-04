let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
const community = new CommunityFunctions ();
const auth = new AuthFunctions();

const user = require('../functions/userFunctions');
const { name, email } = require('../functions/randomizer');
let token = '';

const userName = name.gen();
const userPassword = 'Tester123!';
const userEmail = email.gen();

const welComTitle = "Welcome";

const newComTitle = "hello get Tags";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [];

describe('Registering a test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await auth.register(userName, userEmail, userPassword);
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await auth.login(userName, userPassword);
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


describe('Deleting a test user', () => {
  test('API returns a successful response - code 204', async () => {
      let response = await user.deleteUserByName(token, userName);
      expect(response.status).toBe(204);
  });
});