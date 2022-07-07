/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-undef */
/*  
    Testing to ensure API is running and correct response is given.
    Endpoint is /api/health
*/

const endpoint = process.env.API_REF;
const supertest = require("supertest");

const request = supertest(endpoint);

describe("Testing that api exists and returns response", () => {
  test("API returns code 200", async () => {
    const response = await request.get("/health");
    expect(response.ok).toBe(true);
    expect(response.status).toBe(200);
  });
});
