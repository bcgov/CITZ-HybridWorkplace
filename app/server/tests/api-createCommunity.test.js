let community = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let user = new AuthFunctions();
let token = '';

const welComTitle = "Welcome";
const welComDescript = "Welcome to theNeighbourhood";
const welComRules = "string";

const newComTitle = "hello";
const newComDescript = "world";
const newComyRules = "1. rules";
const newComTags = ["tags"];

const linkCom = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const arrayCom = ["Welcome"];
const arrayCom2 = ["Welcome", "to", "the"];
const intCom = 1231;
const boolCom = false;
const jsonCom = JSON.stringify({
  "colors": [
    {
      "color": "black",
      "category": "hue",
      "type": "primary",
      "code": {
        "rgba": [255,255,255,1],
        "hex": "#000"
      }
    },
    {
      "color": "white",
      "category": "value",
      "code": {
        "rgba": [0,0,0,1],
        "hex": "#FFF"
      }
    }
]});


describe('Logging in the test user', () => {
  test('API returns a successful response - code 201', async () => {
    let response = await user.login('test','Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});


describe('Create Community - With login', () => {
  let response = '';

  beforeAll(async() => {
    await community.deleteCommunity(newComTitle, token);
    response = await community.createCommunity(newComTitle, newComDescript, newComRules, '', token);
  });

  afterAll(async() => {
    response = await community.deleteCommunity(newComTitle, token);
  });

  test('API returns a successful response - code 201', () => {
    expect(response.status).toBe(201);
  });

  test('API returns description and title of new community', () => {
    expect('' +response.text + '').toContain(newComTitle);
    expect('' +response.text + '').toContain(newComDescript);
  });
});

describe('Create Community - With login, but community already exists', () => {
  let response = '';

  beforeAll(async() => {
    response = await community.createCommunity(welComTitle, welComDescript, welComRules, '', token);
  });
  
  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description - "Community already exists."', () => {
    expect('' + response.text + '').toContain("Community already exists.");
  });
});


describe('Create Communities by Title - After Login, with token, but title is an array(1 element)', () => {
  beforeAll( async() => {
    response = await community.createCommunity(arrayCom, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});


describe('Create Communities by Title - After Login, with token, but title is an array(3 elements)', () => {
  beforeAll( async() => {
    response = await community.createCommunity(arrayCom2, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});

describe('Create Communities by Title - After Login, with token, but getting an integer', () => {
  beforeAll( async() => {
    response = await community.createCommunity(intCom, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});

describe('Create Communities by Title - After Login, with token, but getting an boolean', () => {
  beforeAll( async() => {
    response = await community.createCommunity(boolCom, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});

describe('Create Communities by Title - After Login, with token, but getting an object', () => {
  beforeAll( async() => {
    response = await community.createCommunity(community, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});


describe('Create Communities by Title - After Login, with token, but getting a json object', () => {
  beforeAll( async() => {
    response = await community.createCommunity(jsonCom, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});


describe('Create Communities by Title - After Login, with token, but getting a link', () => {
  beforeAll( async() => {
    response = await community.createCommunity(linkCom, newComDescript, '1', '', token);
  });

  test('API returns a unsuccessful response - code 403', () => {
    expect(response.status).toBe(403);
  });

  test('API returns description -  "Invalid token."', () => {
    expect(response.text).toBe("Heelllooo.");
  });
});


describe('Deleting all createdCommunity', () => {
  test('API returns a successful response - code 200 (removes newComTitle)', async() => {
       response = await community.deleteCommunity(newComTitle, token);
       expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes integerCommunity)', async() => {
    response = await community.deleteCommunity(intCom, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes booleanCommunity)', async() => {
    response = await community.deleteCommunity(boolCom, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes arrayCommunity)', async() => {
    response = await community.deleteCommunity(arrayCom, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes second arrayCommunity)', async() => {
    response = await community.deleteCommunity(arrayCom2, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes jsonCommunity)', async() => {
    response = await community.deleteCommunity(jsonCom, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes objectCommunity)', async() => {
    response = await community.deleteCommunity(community, token);
    expect(response.status).toBe(200);
  });

  test('API returns a successful response - code 200 (removes linkCommunity)', async() => {
    response = await community.deleteCommunity(linkCom, token);
    expect(response.status).toBe(200);
  });
});
