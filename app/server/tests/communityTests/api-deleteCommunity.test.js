let { CommunityFunctions } = require('../functions/communityFunctions.js');
let { AuthFunctions } = require('../functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const newComTitle = "hello";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the delete communities function after logging in
describe('Delete Communities - After Login', () => {
  let response = '';
  
  beforeAll( async() => {
    await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
    response = await community.deleteCommunity(newComTitle, token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - "Community removed."', () => {
    expect(response.text).toBe("Community removed.");
  });
});


//Testing the get community function with the "Welcome" community after logging in, but with null as the token
describe('Get Community by Title - With Login, testing with new Community after the deletion', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.getCommunitybyTitle(newComTitle, token);
  });

  test('API returns a unsuccessful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description -  "Community not found."',() => {
    expect(response.text).toBe("Community not found.");
  });
});



describe('Delete Communities - After Login, community does not exist', () => {
  let response = '';
  
  beforeAll( async() => {
    response = await community.deleteCommunity(newComTitle, token);
  });

  test('API returns a successful response - code 404', () => {
    expect(response.status).toBe(404);
  });

  test('API returns description - "Community not found."', () => {
    expect(response.text).toBe("Community not found.");
  });
});