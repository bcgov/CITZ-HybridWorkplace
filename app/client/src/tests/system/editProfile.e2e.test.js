import { UserActions } from "../functions/UserActions";
import puppeteer from "puppeteer";

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

  describe("When user edits their Interests", () => {
    const input = ["Cats", "Dogs"];
    beforeAll(async () => {
      await user.editInterests(input);
    });

    test("Then their interests should reflect those edits", async () => {
      // Checking if interests were successfully edited
      let intrestsChanged = false;
      const chips = await page.$$(
        `#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2 > div:nth-child(3) > div.MuiBox-root > div.MuiChip-root.MuiChip-filled.MuiChip-sizeMedium.MuiChip-colorDefault.MuiChip-filledDefault > span`
      );
      try {
        // Loop through chips. If chip text is from input array, interest must have worked.
        for (let i = 0; i < chips.length; i++) {
          let innerText = await (
            await chips[i].getProperty("innerText")
          ).jsonValue();
          if (input.includes(innerText)) intrestsChanged = true;
        }
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

    test("Then their settings should reflect those edits", async () => {
      // Checking if info was successfully edited
      let infoChanged = false;
      try {
        // Let page load
        await page.waitForFunction(
          `document.getElementById("root").ariaHidden != "true"`,
          {
            timeout: 2000,
          }
        );

        // Check background colour
        let colour = await page.$eval(
          "#root > div",
          (e) => getComputedStyle(e).backgroundColor
        );

        if (colour !== "rgb(18, 18, 18)") throw new Error("Wrong color");

        // Is notification still set?
        // Click edit gear
        const [gear] = await page.$x(
          `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[4]/button`
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

        // Click save
        const [button] = await page.$x(`//button[contains(., 'Close')]`);
        if (button) {
          await button.click();
        }

        // Wait for modal to close
        await page.waitForFunction(
          `document.getElementById("root").ariaHidden != "true"`,
          {
            timeout: 2000,
          }
        );

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

  describe("When user edits their Avatar", () => {
    let colours = {
      pink: { hex: "#cb42f5", rgb: "rgb(203, 66, 245)" },
      purple: { hex: "#690787", rgb: "rgb(105, 7, 135)" },
      blue: { hex: "#0a3194", rgb: "rgb(10, 49, 148)" },
      sky: { hex: "#198ae6", rgb: "rgb(25, 138, 230)" },
      green: { hex: "#059c00", rgb: "rgb(5, 156, 0)" },
      lime: { hex: "#2cd40b", rgb: "rgb(44, 212, 11)" },
      yellow: { hex: "#f0ec05", rgb: "rgb(240, 236, 5)" },
      orange: { hex: "#f0890c", rgb: "rgb(240, 137, 12)" },
      red: { hex: "#e33010", rgb: "rgb(227, 48, 16)" },
      salmon: { hex: "#f0887a", rgb: "rgb(240, 136, 122)" },
    };

    let types = {
      initials: "Initials",
      person: "Person",
      emoji: "Emoji",
    };

    const testType = types.emoji;
    const testColour1 = colours.blue;
    const testColour2 = colours.red;

    beforeAll(async () => {
      // Is page visible?
      await page.waitForFunction(
        `document.getElementById("root").ariaHidden != "true"`,
        {
          timeout: 2000,
        }
      );
      await user.editAvatar(testColour1.hex, testType, testColour2.hex);
    });

    test("Then their Avatar should reflect those edits", async () => {
      // Checking if Avatar was successfully edited
      let avatarChanged = false;
      try {
        // Check if avatar type is correct
        switch (testType) {
          case "Emoji":
            await page.waitForSelector(`svg[data-testid="EmojiEmotionsIcon"]`, {
              timeout: 2000,
            });
            break;
          case "Person":
            await page.waitForSelector(`svg[data-testid="PersonIcon"]`, {
              timeout: 2000,
            });
            break;
          case "Initials":
            await page.waitForXPath(
              `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/button/div/p`,
              {
                timeout: 2000,
              }
            );
            break;
          default:
            break;
        }

        // Check if avatar colour is correct
        // If solid colour, else is gradient
        if (
          (await page.$eval(
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2 > button > div",
            (e) => getComputedStyle(e).backgroundColor
          )) !== "rgba(0, 0, 0, 0)"
        ) {
          const backgroundColor = await page.$eval(
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2 > button > div",
            (e) => getComputedStyle(e).backgroundColor
          );

          if (backgroundColor !== testColour1.rgb)
            throw new Error("Wrong solid colour");
        } else {
          const backgroundImage = await page.$eval(
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2 > button > div",
            (e) => getComputedStyle(e).backgroundImage
          );

          if (
            backgroundImage !==
            `linear-gradient(to right bottom, ${testColour1.rgb}, ${testColour2.rgb})`
          )
            throw new Error("Wrong gradient colours");
        }

        // linear-gradient(to right bottom, rgb(10, 49, 148), rgb(227, 48, 16))

        avatarChanged = true;
      } catch (e) {
        avatarChanged = false;
      }
      expect(avatarChanged).toBeTruthy();
    });
  });
});
