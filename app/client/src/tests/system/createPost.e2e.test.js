import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;

describe("Given that user on Home page", () => {
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
    let title = "Separated function";
    let body = "> wow \n ### this is neat";
    let community = "Welcome";

    beforeAll(async () => {
      await user.createPost(title, body, community);
    });
    test("Then the post should be visible on the Home page", async () => {
      let postIsVisible;
      try {
        let titleCheck = await page.$x(`//b[contains(., '${title}')]`);
        let bodyCheck = await page.$x(`//p[contains(., '${body}')]`);
        if (!titleCheck || !bodyCheck)
          throw new Error(`Didn't find title or body`);
        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });
});
