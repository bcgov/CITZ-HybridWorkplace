let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

let token = '';
let user = new AuthFunctions();

const newCommunityTitle = "hello get";
const newCommunityDescript = "world get";
const newCommunityRules = "hello get";
const newCommunityTags = "world get";

const welcomeCommunityTitle = "Welcome";
const welcomeCommunityDescript = "Test";

// Testing the get community by title function with the "Welcome" community without logging in
describe('Get Community Members - Without Login', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle, '');
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
    let response = await user.login('test','Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the get community by title function with the "Welcome" community after logging in
describe('Get Community Members - With Login, testing with "Welcome" community', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle, token);
  }); 

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community description and title in its response body', () => {
    expect('' + response.text + '').toContain(welcomeCommunityDescript);
    expect('' + response.text + '').toContain(welcomeCommunityTitle);
  });
});



// Testing the get community function with the "Welcome" community after logging in, but with wrong token
describe('Get Community Members - With Login, with invalid token, testing with "Welcome" community', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(welcomeCommunityTitle, token + '11');
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."',() => {
    expect(response.text).toBe("Invalid token.");
  });
});


//Testing the get community function with the "Welcome" community after logging in, but with null as the token
describe('Get Community Members - With Login, testing with null', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(null, token);
  });

  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description -  "Invalid token."',() => {
    expect(response.text).toBe("Community not found.");
  });
});


describe('Creating new Community', () => {
  test('API returns a successful response - code 201',async() => {
      response = await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, token);
      expect(response.status).toBe(201);
  });
});


//Testing the get community function with the "Welcome" community after logging in, but with null as the token
describe('Get Community Members - With Login, testing with new Community', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(newCommunityTitle, token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns description -  includes new community Title',() => {
    expect('' + response.text + '').toContain(newCommunityTitle);
  });
});


describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
       response = await community.deleteCommunity(newCommunityTitle,token);
       expect(response.status).toBe(200);
  });
});


//Testing the get community function with the "Welcome" community after logging in, but with null as the token
describe('Get Community Members - With Login, testing with new Community after the deletion', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(null,token);
  });

  afterAll( async() => {
    response = await community.deleteCommunity(newCommunityTitle, token);
  });

  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description -  "Invalid token."',() => {
    expect(response.text).toBe("Community not found.");
  });
});