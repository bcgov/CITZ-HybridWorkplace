let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";

const newComTitle = "hello set Flags";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [];

const updatedFlag = "Inappropriate";


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
        response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
        expect(response.status).toBe(201);
    });
});


describe('Set up Communities Flags  - create valid flag', () => {
    test('API returns a successful response - code 204', async () => {
        let response = await community.setCommunityFlags(newComTitle, updatedFlag, token);
        expect(response.status).toBe(204);
    });

    test('API returns the new flag', async () => {
        let response = await community.getCommunityFlags(newComTitle, token);
        expect(" " + response.text+ " ").toContain(updatedFlag);
    });
});

describe('Delete Communities Flags  - delete valid flag', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.deleteCommunityFlags(newComTitle, updatedFlag, token);
    });

    test('API returns a successful response - code 204', () => {
        expect(response.status).toBe(204);
    });

    test('API returns a unsuccessful response message - "Success"', () => {
        expect(" " + response.text+ " ").toContain("Success");
    });
});

describe('Delete Communities Flags  - flag does not exist', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.deleteCommunityFlags(newComTitle, updatedFlag, token);
    });

    test('API returns a successful response - code 403', () => {
        expect(response.status).toBe(403);
    });

    test('API returns a unsuccessful response message - "User has not flagged community with new Flag."', () => {
        expect(" " + response.text+ " ").toContain(`User has not flagged community with ${updatedFlag}`);
    });
});

describe('Delete Communities Flags  - no flag given in query', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.deleteCommunityFlags(newComTitle,'', token);
    });

    test('API returns a successful response - code 404', () => {
        expect(response.status).toBe(404);
    });

    test('API returns a unsuccessful response message - "Flag not found in query."', () => {
        expect(" " + response.text+ " ").toContain("Flag not found in query.");
    });
});

describe('Deleting new Community', () => {
    test('API returns a successful response - code 200', async() => {
      let response = await community.deleteCommunity(newComTitle, token);
      expect(response.status).toBe(200);
    });
});
