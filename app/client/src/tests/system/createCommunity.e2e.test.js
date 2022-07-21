import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";


jest.setTimeout(30000);

const idir = 'MSIELECK';
const password = 'RustyCatty2022!';

describe("Given that user is on login page", () => {
  let browser;
  let page;
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
        await page.waitForSelector("p.css-kyzvea", { timeout: 2000 });
        atHomePage = true;
      } catch (e) {
        atHomePage = false;
      }
      expect(atHomePage).toBeTruthy();
    });
  });
});



describe("when the user tries to create a community", () => {
beforeAll(async () => {
    const user = new UserActions(idir, password);
    await user.createCommunity("matts amazing community");
});

test("Then they should be brought to the main page", async () => {
    });
});
