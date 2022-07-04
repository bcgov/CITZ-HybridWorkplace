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

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

const updatedComRules = "2. have fun!!"

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
  test('API returns a successful response - code 201',async() => {
    let response = await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
    expect(response.status).toBe(201);
  });
});


describe('Set Community Rules - With Login, community exists', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.setCommunityRules(newComTitle, updatedComRules, token);
  });

  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - "Community rules updated."', () => {
    expect('' +response.text + '').toBe("Community rules updated.");
  });
});

describe('Leave new Community', () => {
  test('API returns a successful response - code 204', async() => {
    let response = await community.leaveCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});


describe('Set Community Rules - With Login, not a member', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.setCommunityRules(newComTitle,updatedComRules, token);
  });
  
  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "not part of Community."', () => {
    expect('' + response.text + '').toContain("Not part of Community.");
  });
});


describe('Deleting new Community', () => {
  test('API returns a successful response - code 204', async() => {
    let response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(204);
  });
});

describe('Set Community Rules - With Login, but community does not exist', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.setCommunityRules(newComTitle,updatedComRules, token);
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