let { CommunityFunctions } = require('./functions/communityFunctions.js');
let { AuthFunctions } = require('./functions/authFunctions.js');
let community = new CommunityFunctions ();
let user = new AuthFunctions();
let token = '';

const newComTitle = "hello create";
const newComDescript = "world";
const newComRules = "1. rules";
const newComTags = [{
    "tag": "Informative",
    "count": 1
}];

const updatedTags = "new";

const specialTag = '$@#*()#@*()$()&&&*@$@&';
const linkTag = 'https://hwp-express-api-d63404-dev.apps.silver.devops.gov.bc.ca/api';
const arrayTag = ["Matt"];
const arrayTag2 = ["Welcome", "to", "the"];
const intTag = 1231;
const jsonTag = JSON.stringify({
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
    let response = await user.login('test2', 'Tester123!');
    token = response.body.token;
    expect(response.status).toBe(201);
  });
});
  
describe('Creating new Community', () => {
  test('API returns a successful response - code 201', async() => {
    await community.deleteCommunity(newComTitle, token);
    let response = await community.createCommunity(newComTitle, newComDescript, newComRules, newComTags, token);
    expect(response.status).toBe(201);
  });
});

// Testing the get communities function after logging in
describe('Set Communities tags - After Login on new community', () => {
    let response = '';

    beforeAll( async() => {
        response = await community.setCommunityTags(newComTitle, updatedTags, token);
    });

    test('API returns a successful response - code 204', () => {
        expect(response.status).toBe(204);
    });

    test('API returns the updated tag', () => {
        expect(" " + response.text + " ").toContain(updatedTags);
    });
});

describe('Get Communities Tags - After Login with new community (2)', () => {
  test('API returns the updated tag',  async () => {
    response = await community.getCommunityTags(newComTitle, token);
    expect(" " + response.text+ " ").toContain(updatedTags);
  });
});

// Testing the get communities function after logging in
describe('Set Communities tags - on new community, with link tag', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, linkTag, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});

describe('Set Communities tags - on new community, with array tag (1 element)', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, arrayTag, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});

describe('Set Communities tags - on new community, with array tag (3 elements)', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, arrayTag2, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});

describe('Set Communities tags - on new community, with int tag', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, intTag, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});

describe('Set Communities tags - on new community, with json tag', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, jsonTag, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});

describe('Set Communities tags - on new community, with special characters tag', () => {
  let response = '';

  beforeAll( async() => {
      response = await community.setCommunityTags(newComTitle, specialTag, token);
  });

  test('API returns a unsuccessful response - code 403', () => {
      expect(response.status).toBe(403);
  });
});


describe('Deleting new Community', () => {
  test('API returns a successful response - code 200', async() => {
    let response = await community.deleteCommunity(newComTitle, token);
    expect(response.status).toBe(200);
  });
});
