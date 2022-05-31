var community = require('./functions/communityFunctions.js');
var user = require('./functions/userFunctions.js');
let token = '';

const newCommunityTitle = "hello delete";
const newCommunityDescript = "world delete";
const newCommunityRules = "rules delete";

// Testing the delete communities function without logging in
describe('Delete Communities - Without Login', () => {
  let response = '';
  
  beforeAll(async() => {
    await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,'');
    response = await community.deleteCommunity(newCommunityTitle,'');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


describe('Logging in the test user', () => {
  test('Test account can log in', async () => {
    let response = await user.loginUser('test','Test123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the delete communities function after logging in
describe('Delete Communities - After Login', () => {
  let response = '';
  
  beforeAll(async() => {
    await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,token);
    response = await community.deleteCommunity(newCommunityTitle,token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns description - "Community removed."', () => {
    expect(response.text).toBe("Community removed.");
  });
});


// Testing the delete communities function after logging in, but without token
describe('Delete Communities - After Login, without token', () => {
  let response = '';
  
  beforeAll(async() => {
    await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,'');
    response = await community.deleteCommunity(newCommunityTitle,'');
  });

  test('API returns a unsuccessful response - code 401', () => {
    expect(response.status).toBe(401);
  });

  test('API returns description - "Not Authorized."', () => {
    expect(response.text).toBe("Not Authorized.");
  });
});


// Testing the delete communities function after logging in, but with wrong token
describe('Delete Communities - After Login, with modified token', () => {
  let response = '';
  
  beforeAll(async() => {
    await community.createCommunity(newCommunityTitle,newCommunityDescript,newCommunityRules,token + "11");
    response = await community.deleteCommunity(newCommunityTitle,token+ "11");
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Forbidden."', () => {
    expect(response.text).toBe("Forbidden.");
  });
});
