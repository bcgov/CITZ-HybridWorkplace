let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');

let token = '';
let user = new AuthFunctions();

const welComTitle = "Welcome";
const welComDescript = "The Neighbourhood";


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


// Testing the get communities function after logging in
describe('Get Communities - After Login', () => {
  let response = '';

  beforeAll( async() => {
    response = await community.getCommunities(token);
  });

  test('API returns a successful response - code 200', () => {
    expect(response.status).toBe(200);
  });

  test('API returns the "Welcome" community description and title in its response body', () => {
    expect(" " + response.text+ " ").toContain(welComDescript);
    expect(" " + response.text + " ").toContain(welComTitle);
  });
});