let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
let user = new AuthFunctions();
let community = new CommunityFunctions();
let token = '';


const newComTitle = "hello join";
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

describe('Join Community by Title - With Login, community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.joinCommunity(newComTitle, token);
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
  let response = '';

  beforeAll(async() => {
    response = await community.joinCommunity(newComTitle, token);
  });

  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - "Successfully joined community."', () => {
    expect('' +response.text + '').toBe("Successfully joined community.");
  });
});


describe('Join Community by Title - With Login, but already a member', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.joinCommunity(newComTitle, token);
  });
  
  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "already joined Community."', () => {
    expect('' + response.text + '').toContain("already joined Community.");
  });
});


describe('Get Community Members - With Login, testing with "new" community', () => {
  let response = '';

  beforeAll(async() => {
      response = await community.getCommunityMembers(newComTitle, 'true', token);
  }); 

  test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
  });

  test('API returns the member count of 1', () => {
      expect('' + response.text + '').toContain('1');
  });
});



describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });
});

describe('Join Community by Title - With Login, but community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.joinCommunity(newComTitle, token);
  });
  
  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community already exists."', () => {
    expect('' + response.text + '').toContain("Community not found.");
  });
});

