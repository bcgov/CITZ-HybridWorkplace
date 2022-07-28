import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";


jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const slowmo = process.env.SLOWMO;
const headless = process.env.HEADLESS;

describe("Given that user is on login page", () => {
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

    user = new UserActions(idir, password, page);
    await user.login();
  });

  describe("when the user tries to create a community", () => {
    const communityName = "matts amazing community";
    const communityDescript = "the best community you can find";

    beforeAll(async () => {
        await user.createCommunity(communityName, communityDescript);
    });
    
    test("They should see the community on the main page", async () => {
      let postIsVisible;
      try {
        await page.waitForXPath(`//*[contains(., "${communityName}")]`, {
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

