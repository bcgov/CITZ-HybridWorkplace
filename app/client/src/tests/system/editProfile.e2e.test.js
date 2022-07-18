import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";
import { min } from "moment";

jest.setTimeout(30000);

const idir = process.env.IDIR;
const password = process.env.PASSWORD;
const headless = process.env.HEADLESS === "true";
const slowmo = parseInt(process.env.SLOWMO);

describe("Given that user is on Profile page", () => {
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
    await user.goToProfileByAvatar();
  });

  afterAll(async () => {
    browser.close();
  });

  describe("When user edits their bio", () => {
    let input = "editProfile Bio";
    beforeAll(async () => {
      await user.editBio(input);
    });

    test("Then their bio should reflect those edits", async () => {
      // Checking if bio was successfully edited
      let bioChanged = false;
      try {
        await page.waitForXPath(`//p[contains(., '${input}')]`, {
          timeout: 2000,
        });
        bioChanged = true;
      } catch (e) {
        bioChanged = false;
      }
      expect(bioChanged).toBeTruthy();
    });
  });

  /**** Cannot get chip after for some reason, but it is created. ****/
  describe("When user edits their Interests", () => {
    let input = ["Cats", "Dogs"];
    beforeAll(async () => {
      await user.editInterests(input);
    });

    test("Then their interests should reflect those edits", async () => {
      // Checking if interests were successfully edited
      let intrestsChanged = false;
      try {
        for (let i = 0; i < input.length; i++) {
          await this.page.waitForSelector(
            `span[class='MuiChip-label'][innerText='${input[0]}')]`,
            {
              timeout: 2000,
            }
          );
        }

        intrestsChanged = true;
      } catch (e) {
        intrestsChanged = false;
      }
      expect(intrestsChanged).toBeTruthy();
    });
  });

  describe("When user edits their User Info", () => {
    const firstName = "John";
    const lastName = "Scott";
    const title = "NHL Player";
    const ministry = "Silly Walks";

    beforeAll(async () => {
      await user.editInfo(firstName, lastName, title, ministry);
    });

    test("Then their User Info should reflect those edits", async () => {
      // Checking if info was successfully edited
      let infoChanged = false;
      try {
        await page.waitForXPath(
          `//h5[contains(., '${firstName} ${lastName}')]`,
          {
            timeout: 2000,
          }
        );
        await page.waitForXPath(`//p[contains(., '${title}')]`, {
          timeout: 2000,
        });
        await page.waitForXPath(`//p[contains(., '${ministry}')]`, {
          timeout: 2000,
        });
        infoChanged = true;
      } catch (e) {
        infoChanged = false;
      }
      expect(infoChanged).toBeTruthy();
    });
  });

  describe("When user changes their settings", () => {
    let notification = "immediate";
    let theme = "dark";

    beforeAll(async () => {
      await user.editSettings(notification, theme);
    });

    test("Then their User Info should reflect those edits", async () => {
      // Checking if info was successfully edited
      let infoChanged = false;
      try {
        // Let page load
        await page.waitForSelector(`#root > div`, {
          timeout: 2000,
        });
        await page.waitForTimeout(3000);

        // Check background colour
        let colour = await page.$eval(
          "#root > div",
          (e) => getComputedStyle(e).backgroundColor
        );

        if (colour !== "rgb(18, 18, 18)") throw new Error("Wrong color");

        // Is notification still set?
        // Click edit gear
        const [gear] = await page.$x(
          `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[3]/button`
        );
        if (gear) {
          await gear.click();
        }

        // Wait for radio to appear, then see if checked
        await page.waitForXPath(`//input[@value="${notification}"]`);
        const radio = await page.$(`input[value="${notification}"`);
        const isCheckBoxChecked = await (
          await radio.getProperty("checked")
        ).jsonValue();
        if (!isCheckBoxChecked) {
          throw new Error("Wrong notification setting");
        }

        infoChanged = true;
      } catch (e) {
        infoChanged = false;
        console.log(e);
      }
      expect(infoChanged).toBeTruthy();
    });
  });
});
