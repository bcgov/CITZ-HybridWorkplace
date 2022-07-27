import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";


jest.setTimeout(30000);

const idir = process.env.IDIR 
const password = process.env.PASSWORD

describe("Given that user is on login page", () => {
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

    user = new UserActions(idir, password, page);
    await user.login();
  });

  describe("when the user tries to create a community", () => {
    beforeAll(async () => {
        await user.createCommunity("matts amazing community");
    });
    
    test("Then they should be brought to the main page", async () => {

    });
  });
});

