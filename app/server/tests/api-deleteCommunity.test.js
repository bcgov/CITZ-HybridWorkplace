var community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

let token = '';
let user = new AuthFunctions();

const newCommunityTitle = "hello delete";
const newCommunityDescript = "world delete";
const newCommunityRules = "rules delete";
const newCommunityTags = "tags";

// Testing the delete communities function without logging in
describe('Delete Communities - Without Login', () => {
  let response = '';
  
  beforeAll( async() => {
    await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, '');
    response = await community.deleteCommunity(newCommunityTitle, '');
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


// Testing the delete communities function after logging in
describe('Delete Communities - After Login', () => {
  let response = '';
  
  beforeAll( async() => {
    await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, token);
    response = await community.deleteCommunity(newCommunityTitle, token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - "Community removed."', () => {
    expect(response.text).toBe("Community removed.");
  });
});


describe('Delete Communities - After Login, community does not exist', () => {
  let response = '';
  
  beforeAll( async() => {
    response = await community.deleteCommunity(newCommunityTitle, token);
  });

  test('API returns a successful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community removed."', () => {
    expect(response.text).toBe("Community not found.");
  });
});


// Testing the delete communities function after logging in, but without token
describe('Delete Communities - After Login, without token', () => {
  let response = '';
  
  beforeAll( async() => {
    await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, '');
    response = await community.deleteCommunity(newCommunityTitle, '');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Missing token."', () => {
    expect(response.text).toBe("Missing token.");
  });
});


// Testing the delete communities function after logging in, but with wrong token
describe('Delete Communities - After Login, with modified token', () => {
  let response = '';
  
  beforeAll( async() => {
    await community.createCommunity(newCommunityTitle, newCommunityDescript, newCommunityRules, newCommunityTags, token + "11");
    response = await community.deleteCommunity(newCommunityTitle, token + "11");
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Invalid token."', () => {
    expect(response.text).toBe("Invalid token.");
  });
});
