let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let user = new AuthFunctions();
let token = '';
jest.setTimeout(10000);

const newComTitle = "hello leave";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2','Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});

describe('Leave Community by Title - With Login, community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect('' + response.text + '').toContain("Community not found.");
  });
});


describe('Creating new Community', () => {
  test('API returns a successful response - code 201',async() => {
    response = await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
    expect(response.status).toBe(201);
  });
});


describe('Join Community by Title - With Login, community exists', () => {
    test('API returns a successful response - code 204', async () => {
    let response = await community.joinCommunity(newComTitle, token);
    expect(response.status).toBe(204);
    });
  });



describe('Leave Community by Title - With Login, community exists', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.leaveCommunity(newComTitle, token);
  });

  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - "Successfully left community. "', () => {
    expect('' + response.text + '').toBe("Successfully left community.");
  });
});


describe('Leave Community by Title - With Login, but already left', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.leaveCommunity(newComTitle, token);
  });
  
  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect('' + response.text + '').toContain("Community not found.");
  });
});


describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });
});

describe('Leave Community by Title - With Login, but community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.leaveCommunity(newComTitle, token);
  });
  
  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community already exists."', () => {
    expect('' + response.text + '').toContain("Community not found.");
  });
});
