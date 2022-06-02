let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

let token = '';
let user = new AuthFunctions();

const newCommunityTitle = "hello";
const newCommunityDescript = "world";
const newCommunityRules = "rules";
const newCommunityTags = "tags";

const updatedCommunityTitle = "hello world";
const updatedCommunityDescript = "world hello";


describe('Edit Community - Without login', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(newCommunityTitle, updatedCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, '');
  });
  
  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Missing token."', () => {
    expect(response.text).toBe("Missing token.");
  });
});


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test', 'Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Creating new Community', () => {
  test('API returns a successful response - code 201', async() => {
      response = await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, '', token);
      expect(response.status).toBe(201);
  });
});


describe('Edit Community - With login, but without token', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(newCommunityTitle, updatedCommunityTitle, newCommunityDescript, newCommunityRules, '', '');
  });
  
  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Missing token."', () => {
    expect(response.text).toBe("Missing token.");
  });
});


describe('Edit Community - With login, change title', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(newCommunityTitle, updatedCommunityTitle, newCommunityDescript, newCommunityRules, '', token);
  });
  
  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});


describe('Get Communities - get altered community title (1)', () => {
  test('API returns the "Welcome" community description and title in its response body', async () => {
    let response = await community.getCommunitybyTitle(updatedCommunityTitle, token);
    expect(response.status).toBe(200);
    expect(" " + response.text + " ").toContain(newCommunityDescript);
    expect(" " + response.text + " ").toContain(updatedCommunityTitle);
  });
});


describe('Get Communities - get old community title (1)', () => {
  test('Api returns a unsuccessful respone - code 404', async () => {
    let response = await community.getCommunitybyTitle(newCommunityTitle, token);
    expect(response.status).toBe(404);
  });
});


describe('Edit Community - With login, same community back to original title', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(updatedCommunityTitle, newCommunityTitle, newCommunityDescript, newCommunityRules, '', token);
  });
  
  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});


describe('Get Communities - get altered community title (2)', () => {
  test('API returns the "Welcome" community description and title in its response body', async () => {
    let response = await community.getCommunitybyTitle(newCommunityTitle, token);
    expect(response.status).toBe(200);
    expect(" " + response.text + " ").toContain(newCommunityDescript);
    expect(" " + response.text + " ").toContain(newCommunityTitle);
  });
});


describe('Get Communities - get old community title (2)', () => {
  test('Api returns a unsuccessful respone - code 404', async () => {
    let response = await community.getCommunitybyTitle(updatedCommunityTitle, token);
    expect(response.status).toBe(404);
  });
});


describe('Removing new Community', () => {
  test('API returns a successful response - code 200', async() => {
      response = await community.deleteCommunity(newCommunityTitle, token);
      expect(response.status).toBe(200);
  });
});
