import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";
import $ from "jquery";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;

describe("Given that user is on the Home page", () => {
  let browser;
  let page;
  let user;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 10,
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
        await page.waitForXPath(`//b[contains(., "${title}")]`, {
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
});
