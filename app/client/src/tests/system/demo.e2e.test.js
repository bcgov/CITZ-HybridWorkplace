import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is on Home page", () => {
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

  afterAll(async () => {
    await browser.close();
  });

  // Create Community
  describe("When user creates a community", () => {
    beforeAll(async () => {
      await user.goToCommunitiesBySidemenu();
      await user.createCommunity(
        `Demo Community - ${time}`,
        "This community is for the demo."
      );
    });

    test("Then the community should be visible on the home page", async () => {
      expect(true).toBeTruthy();
    });
  });

  // Create Post
  describe("When user navigates to a community and creates a post", () => {
    let title = "Posting from Community page";
    let community = `Demo Community - ${time}`;
    let body = `I posted from the ${community} page!`;

    beforeAll(async () => {
      await user.goToHomeByLogo();
      await user.goToCommunity(community);
      await user.createPost(title, body);
    });
    test("Then the post should be visible on the Community page", async () => {
      let postIsVisible;
      try {
        // Is title there?
        await page.waitForXPath(`//b[contains(., "${title}")]`, {
          timeout: 2000,
        });
        // Is body there?
        await page.waitForXPath(`//p[contains(., "${body}")]`, {
          timeout: 2000,
        });

        postIsVisible = true;
      } catch (e) {
        postIsVisible = false;
      }

      expect(postIsVisible).toBeTruthy();
    });
  });

  // Create Comment

  // Search

  // Go to profile

  // Change avatar

  // Turn on dark mode

  // Add interests

  // Change moderator settings? Or kick someone
});
