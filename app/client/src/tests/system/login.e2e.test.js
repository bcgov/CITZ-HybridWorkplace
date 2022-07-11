import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

const homepage = process.env.URL_TARGET;
const idir = process.env.IDIR;
const password = process.env.PASSWORD;

describe("Given that user is on login page", () => {
  let page;
  const setup = async () => {
    const browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto("https://example.com");
  };
  setup();
  // const user = new UserActions(idir, password, page);
  describe("When user logs in", () => {
    // user.login();
    test("Then they should be brought to the main page", () => {
      expect(
        document.querySelector(`img[alt="user account avatar"]`)
      ).toBeInTheDocument();
    });
  });
});
