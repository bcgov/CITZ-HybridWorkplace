let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let user = new AuthFunctions();
let token = '';

const newComTitle = "hello patches";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

const updatedCommunityTitle = "hello new world";

describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Creating new Community', () => {
  test('API returns a successful response - code 201', async() => {
      response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
      expect(response.status).toBe(201);
  });
});


describe('Edit Community - With login, change title', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(newComTitle, updatedCommunityTitle, newComDescript, newComRules, token);
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
    expect(" " + response.text + " ").toContain(newComDescript);
    expect(" " + response.text + " ").toContain(updatedCommunityTitle);
  });
});


describe('Get Communities - get old community title (1)', () => {
  test('Api returns a unsuccessful respone - code 404', async () => {
    let response = await community.getCommunitybyTitle(newComTitle, token);
    expect(response.status).toBe(404);
  });
});

describe('Edit Community - With login, same community back to original title', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(updatedCommunityTitle, newComTitle, newComDescript, newComRules, token);
  });
  
  test('API returns a successful response - code 204', () => {
    expect(response.status).toBe(204);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});


describe('Get Communities - get altered community title (2)', () => {
  test('API returns the "new" community description and title in its response body', async () => {
    let response = await community.getCommunitybyTitle(newComTitle, token);
    expect(response.status).toBe(200);
    expect(" " + response.text + " ").toContain(newComDescript);
    expect(" " + response.text + " ").toContain(newComTitle);
  });
});


describe('Get Communities - get old community title (2)', () => {
  test('Api returns a unsuccessful respone - code 404', async () => {
    let response = await community.getCommunitybyTitle(updatedCommunityTitle, token);
    expect(response.status).toBe(404);
  });
});


describe('Edit Community - With login and token, change all fields to empty', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.patchCommunitybyTitle(newComTitle, '', '', '', token);
  });
  
  test('API returns a successful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - ""', () => {
    expect(response.text).toBe("");
  });
});

describe('Edit Community - With login and token, running multiple edits synchronously ', () => {
  let response = '';

  beforeAll( async() => {
    community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '1', newComRules, token);
    community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '2', newComRules, token);
    community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '3', newComRules, token);
    community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '4', newComRules, token);
    community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '5', newComRules, token);
    await community.patchCommunitybyTitle(newComTitle, newComTitle, newComDescript + '6', newComRules, token);
    response = await community.getCommunitybyTitle(newComTitle, token);
  });
  
  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - ""', () => {
    expect(response.text).toContain(newComDescript + "6");
  });
});


describe('Removing new Community', () => {
  test('API returns a successful response - code 200', async() => {
      response = await community.deleteCommunity(newComTitle, token);
      expect(response.status).toBe(200);
  });
});

describe('Removing old Community', () => {
  test('API returns a unsuccessful response - code 404', async() => {
      response = await community.deleteCommunity(updatedCommunityTitle, token);
      expect(response.status).toBe(404);
  });
});

