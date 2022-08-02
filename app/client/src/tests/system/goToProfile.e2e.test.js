import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is on home page", () => {
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
    user = new UserActions(idir, password, page);
    await user.login();
  });

  // Reset to home page before each test
  beforeEach(async () => {});

  afterAll(async () => {
    browser.close();
  });

  describe("When user clicks the avatar", () => {
    beforeAll(async () => {
      await user.goToHomeByFooter();
      await user.goToProfileByAvatar();
    });

    test("Then they should be brought to the Profile page", async () => {
      // Checking if settings cog is visible
      let atProfilePage = false;
      try {
        await page.waitForSelector(`svg[data-testid="SettingsRoundedIcon"]`, {
          timeout: 2000,
        });
        atProfilePage = true;
      } catch (e) {
        atProfilePage = false;
      }
      expect(atProfilePage).toBeTruthy();
    });
  });

  describe("When user opens the sidemenu and clicks Profile", () => {
    beforeAll(async () => {
      await user.goToHomeByFooter();
      await user.goToProfileBySidemenu();
    });

    test("Then they should be brought to the Profile page", async () => {
      // Checking if settings cog is visible
      let atProfilePage = false;
      try {
        await page.waitForSelector(`svg[data-testid="SettingsRoundedIcon"]`, {
          timeout: 2000,
        });
        atProfilePage = true;
      } catch (e) {
        atProfilePage = false;
      }
      expect(atProfilePage).toBeTruthy();
    });
  });
});
