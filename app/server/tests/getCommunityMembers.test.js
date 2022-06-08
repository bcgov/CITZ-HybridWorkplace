let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

let token = '';
let user = new AuthFunctions();

const newComTitle = "hello get members";
const newComDescript = "world";
const newComRules = "hello";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

const welComTitle = "Welcome";
const welComDescript = "Test";

const testIDIR = 'test2';
const testPassword = 'Tester123!';

describe('Logging in the test user', () => {
    test('API returns a successful response - code 201', async () => {
            let response = await user.login(testIDIR, testPassword);
            token = response.body.token;
            expect(response.status).toBe(201);
        });
});


describe('Get Community Members - With Login, testing with "Welcome" community', () => {
    let response = '';

    beforeAll(async() => {
        response = await community.getCommunityMembers(welComTitle, 'false', token);
    }); 

    test('API returns a successful response - code 200', () => {
        expect(response.status).toBe(200);
    });

    test('API returns the "Welcome" community description and title in its response body', () => {
        expect('' + response.text + '').toContain(testIDIR);
    });
});


describe('Creating new Community', () => {
  test('API returns a successful response - code 201',async() => {
      response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
      expect(response.status).toBe(201);
  });
});


describe('Get Community Member count - With Login, testing with new Community', () => {
    let response = '';

    beforeAll(async() => {
        response = await community.getCommunityMembers(newComTitle, 'true', token);
    });

    test('API returns a successful response - code 200', () => {
        expect(response.status).toBe(200);
    });

    test('API returns description -  includes new community Title',() => {
        expect('' + response.text + '').toContain('1');
    });
});

describe('Leaving new Community', () => {
    test('API returns a successful response - code 200', async() => {
        response = await community.leaveCommunity(newComTitle, token);
        expect(response.status).toBe(204);
    });
});

describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
       response = await community.deleteCommunity(newComTitle,token);
       expect(response.status).toBe(200);
  });
});


describe('Get Community Members - With Login, but community does not exist', () => {
    let response = '';

    beforeAll(async() => {
        response = await community.getCommunityMembers(newComTitle, 'false', token);
    });

    test('API returns a unsuccessful response - code 404', () => {
        expect(response.status).toBe(404);
    });

    test('API returns description - "Community already exists."', () => {
        expect('' + response.text + '').toContain("Community not found.");
    });
});
