import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);
const homepage = process.env.URL_TARGET;
const idir = process.env.IDIR;
const password = process.env.PASSWORD;

// const user = new UserActions(idir, password, page, homepage);

describe("Given that user is on login page", () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false, slowMo: 0 });
    page = await browser.newPage();
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    await page.goto("http://localhost:8080");
  });

  afterAll(async () => {
    browser.close();
  });

  describe("When user logs in", () => {
    beforeAll(async () => {
      // Go to login page
      await page.goto(`http://localhost:8080/login`);
      // await page.waitForTimeout(5000);
      await page.waitForSelector(".css-ojc9ou"); // Login button

      // Click login button
      await page.click(".css-ojc9ou");
      await page.waitForNavigation({ waitUntil: "domcontentloaded" });

      // Enter info into fields
      await page.type("#user", idir);
      await page.type("#password", password);

      // Click Continue Button
      await page.click(`[value="Continue"]`);

      // // Wait for Avatar to appear
      await page.waitForSelector(`p.css-kyzvea`);
    });

    test("Then they should be brought to the main page", async () => {
      let atHomePage;
      try {
        await page.waitForSelector("p.css-kyzvea");
        atHomePage = true;
      } catch (e) {
        atHomePage = false;
      }
      expect(atHomePage).toBeTruthy();
    });
  });
});
