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

const newComTitle = "hello leave";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

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

describe('Get Community Members - With Login, testing with "new" community', () => {
  let response = '';

  beforeAll(async() => {
      response = await community.getCommunityMembers(newComTitle, true, token);
  }); 

  test('API returns a successful response - code 200', () => {
      expect(response.status).toBe(200);
  });

  test('API returns the member count of 0', () => {
      expect('' + response.text + '').toContain('0');
  });
});



describe('Deleting new Community', () => {
  test('API returns a successful response - code 204', async() => {
    response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe('Leave Community by Title - With Login, but community does not exist', () => {
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


describe('Deleting a test user', () => {
  test('API returns a successful response - code 204', async () => {
      let response = await user.deleteUserByName(token, userName);
      expect(response.status).toBe(204);
  });
});