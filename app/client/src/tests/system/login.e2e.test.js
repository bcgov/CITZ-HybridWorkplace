import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is on login page", () => {
  let browser;
  let page;
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
  });

  afterAll(async () => {
    browser.close();
  });

  describe("When user logs in", () => {
    beforeAll(async () => {
      const user = new UserActions(idir, password, page);
      await user.login();
    });

    test("Then they should be brought to the main page", async () => {
      // Checking if avatar is visible
      let atHomePage = false;
      try {
        await page.waitForXPath(
          `//button[@aria-label="account of current user"]`,
          { timeout: 2000 }
        );
        atHomePage = true;
      } catch (e) {
        atHomePage = false;
      }
      expect(atHomePage).toBeTruthy();
    });
  });
});
