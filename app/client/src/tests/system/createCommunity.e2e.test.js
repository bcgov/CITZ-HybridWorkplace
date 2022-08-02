import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is logged in and on the homepage", () => {
  let browser;
  let page;
  let user;
  const time = new Date().getMilliseconds();

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

    user = new UserActions(idir, password, page);
    await user.login();
  });

  describe("When the user tries to create a community", () => {
    const communityName = `matts amazing community ${time}`;
    const communityDescript = "the best community you can find";

    beforeAll(async () => {
      await user.goToCommunitiesBySidemenu();
      await user.createCommunity(communityName, communityDescript);
    });

    test("They should see the community on the home page", async () => {
      let communityIsVisible;
      try {
        await page.waitForXPath(`//*[contains(., "${communityName}")]`, {
          timeout: 2000,
        });
        communityIsVisible = true;
      } catch (e) {
        communityIsVisible = false;
      }

      expect(communityIsVisible).toBeTruthy();
    });
  });
});
