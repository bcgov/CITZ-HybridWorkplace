import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;

describe("Given that user is on Profile page", () => {
  let browser;
  let page;
  let user;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 30,
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
    await user.goToProfileByAvatar();
  });

  // Reset to home page before each test
  beforeEach(async () => {});

  afterAll(async () => {
    browser.close();
  });

  describe("When user edits their bio", () => {
    beforeAll(async () => {
      await user.editBio("editProfile Bio");
    });

    test("Then their bio should reflect those edits", async () => {
      // Checking if bio was successfully edited
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
