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

const newComTitle = "hello set Flags";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [];

const updatedFlag = "Inappropriate";
const updatedFlagBad = "weird ;(";
const linkFlag = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api-docs/#/';


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

describe('Creating new Community', () => {
    test('API returns a successful response - code 201', async() => {
        await community.deleteCommunity(newComTitle, token);
        response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
        expect(response.status).toBe(201);
    });
});

describe('Set Communities Flags  - After Login', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.setCommunityFlags(newComTitle, updatedFlag, token);
    });

    test('API returns a successful response - code 204', () => {
        expect(response.status).toBe(204);
    });

    test('API returns a successful response message - "Success"', () => {
        expect(" " + response.text+ " ").toContain("Success");
    });
});


describe('Get Communities Flags  - After Login', () => {
    test('API returns the "Welcome" tags in its response body', async () => {
        let response = await community.getCommunityFlags(newComTitle, token);
        expect(" " + response.text+ " ").toContain(updatedFlag);
    });
});

describe('Set Communities Flags  - After Login, bad flag', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.setCommunityFlags(newComTitle, updatedFlagBad, token);
    });

    test('API returns a unsuccessful response - code 403', () => {
        expect(response.status).toBe(403);
    });

    test('API returns a unsuccessful response message - "Invalid Tag"', () => {
        expect(" " + response.text+ " ").toContain("Invalid flag");
    });
});


describe('Get Communities Flags  - After Login', () => {
    test('API returns the "Welcome" tags in its response body', async () => {
        let response = await community.getCommunityFlags(newComTitle, token);
        expect(" " + response.text+ " ").not.toContain(updatedFlagBad);
    });
});

describe('Set Communities Flags  - After Login, bad flag', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.setCommunityFlags(newComTitle, linkFlag, token);
    });

    test('API returns a unsuccessful response - code 403', () => {
        expect(response.status).toBe(403);
    });

    test('API returns a unsuccessful response message - "Invalid Tag"', () => {
        expect(" " + response.text+ " ").toContain("Invalid flag");
    });
});


describe('Get Communities Flags  - After Login', () => {
    test('API returns the "Welcome" tags in its response body', async () => {
        let response = await community.getCommunityFlags(newComTitle, token);
        expect(" " + response.text+ " ").not.toContain(linkFlag);
    });
});

describe('Deleting new Community', () => {
    test('API returns a successful response - code 204', async() => {
      let response = await community.deleteCommunity(newComTitle, token);
      expect(response.status).toBe(204);
    });
});


describe('Deleting a test user', () => {
    test('API returns a successful response - code 204', async () => {
        let response = await user.deleteUserByName(token, userName);
        expect(response.status).toBe(204);
    });
});