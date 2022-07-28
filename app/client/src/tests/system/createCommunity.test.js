import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is on the Home page", () => {
  let browser;
  let page;
  let user;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: headless,
      slowMo: slowmo,
      args: [`--window-size=1366,768`],
    });
    page = await browser.newPage();
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    await page.goto("http://localhost:8080");
    user = await new UserActions(idir, password, page);
    await user.login();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("When user creates a new community", () => {
    let title = "Posting from Home page Community";
    let description = "> block quote \n ### header 3";

    beforeAll(async () => {
      await user.createCommunity(title, description);
    });
    test("Then the post should be visible on the Home page", async () => {
      let postIsVisible;
      try {
        // Is title there?
        await page.waitForXPath(`//b[contains(., "${title}")]`, {
          timeout: 2000,
        });
        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });

  describe("When user navigates to the communities page and create a community", () => {
    let title = "Posting from Community page";
    let community = "Welcome";
    let body = `I posted from the ${community} page!`;

    beforeAll(async () => {
      await user.goToHomeByLogo();
      await user.goToCommunity(community);
      await user.createPost(title, body);
    });
    test("Then the post should be visible on the Community page", async () => {
      let postIsVisible;
      try {
        // Is title there?
        await page.waitForXPath(`//b[contains(., "${title}")]`, {
          timeout: 2000,
        });
        // Is body there?
        await page.waitForXPath(`//p[contains(., "${body}")]`, {
          timeout: 2000,
        });

        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });
});
