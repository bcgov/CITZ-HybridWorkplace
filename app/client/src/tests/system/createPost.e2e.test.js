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
    browser.close();
  });

  describe("When user creates a post", () => {
    beforeAll(async () => {
      //let add = await page.$('button.css-zbvyun');
      await page.waitForSelector("button.css-rxr26v"); // try to get first + button
      await page.click("button.css-rxr26v"); // try to click first + button
      await page.waitForSelector("#add-post-title"); // wait for field to appear

      await page.type("#add-post-title", "createPost with Puppeteer"); // type in title field
      await page.type(
        "textarea.w-md-editor-text-input",
        `
      ### header
      **bold**
      and some text`
      ); // type in body field

      await page.click('div[aria-haspopup="listbox"]'); // open select menu
      await page.click('li[data-value="Welcome"]'); // select community

      await page.click("button.css-ojc9ou"); // click submit
    });
    test("Then the post should be visible on the Home page", async () => {
      let postIsVisible;
      try {
        await page.$x(`//b[contains(., 'createPost with Puppeteer')]`);
        await page.$x(`//p[contains(., '
        ### header
        **bold**
        and some text')]`);
        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });
});
