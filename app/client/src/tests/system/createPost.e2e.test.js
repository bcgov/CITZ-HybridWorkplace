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
    await page.goto(process.env.URL);
    user = await new UserActions(idir, password, page);
    await user.login();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("When user creates a post", () => {
    let title = "Posting from Home page";
    let body = "> block quote \n ### header 3";
    let community = "Welcome";

    beforeAll(async () => {
      await user.createPost(title, body, community);
    });
    test("Then the post should be visible on the Home page", async () => {
      let postIsVisible;
      try {
        // Is title there?
        await page.waitForXPath(`//h6[contains(., "${title}")]`, {
          timeout: 2000,
        });
        // Is blockquote there?
        await page.waitForXPath(`//blockquote[contains(p, "block quote")]`, {
          timeout: 2000,
        });
        // Is header there?
        await page.waitForXPath(`//h3[contains(., "header 3")]`, {
          timeout: 2000,
        });

        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });

  describe("When user navigates to a community and creates a post", () => {
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
        await page.waitForXPath(`//h6[contains(., "${title}")]`, {
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
