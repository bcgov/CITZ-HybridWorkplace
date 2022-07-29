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
    const communityName = `Demo Community - ${time}`;
    beforeAll(async () => {
      await user.goToCommunitiesBySidemenu();
      await user.createCommunity(
        communityName,
        "This community is for the demo."
      );
    });

    test("Then the community should be visible on the home page", async () => {
      let communityIsVisible;
      try {
        // Is community on sidebar?
        await page.waitForXPath(`//b[contains(., "${communityName}")]`, {
          timeout: 2000,
        });

        communityIsVisible = true;
      } catch (e) {
        communityIsVisible = false;
      }

      expect(communityIsVisible).toBeTruthy();
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
  describe("When user comments on a post", () => {
    const comment = "Commenting for the demo!";
    beforeAll(async () => {
      await user.goToPost("Posting from Community page");
      await user.addComment(comment);
    });

    test("Then that comment should be visible on the post page", async () => {
      let commentIsVisible;
      try {
        // Is comment body there?
        await page.waitForXPath(`//p[contains(., "${comment}")]`, {
          timeout: 2000,
        });

        commentIsVisible = true;
      } catch (e) {
        commentIsVisible = false;
      }

      expect(commentIsVisible).toBeTruthy();
    });
  });

  // Search

  // Go to profile
  describe("When user clicks on avatar", () => {
    beforeAll(async () => {
      await user.goToProfileByAvatar();
    });

    test("Then they should arrive at the Profile page", async () => {
      // Checking if settings cog is visible
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

  // Change avatar
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
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2.css-1r3qf17 > button > div",
            (e) => getComputedStyle(e).backgroundColor
          )) !== "rgba(0, 0, 0, 0)"
        ) {
          const backgroundColor = await page.$eval(
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2.css-1r3qf17 > button > div",
            (e) => getComputedStyle(e).backgroundColor
          );

          if (backgroundColor !== testColour1.rgb)
            throw new Error("Wrong solid colour");
        } else {
          const backgroundImage = await page.$eval(
            "#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2.css-1r3qf17 > button > div",
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

  // Turn on dark mode
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

  // Add interests
  describe("When user edits their Interests", () => {
    const input = ["Cats", "Dogs"];
    beforeAll(async () => {
      await user.editInterests(input);
    });

    test("Then their interests should reflect those edits", async () => {
      // Checking if interests were successfully edited
      let intrestsChanged = false;
      const chips = await page.$$(
        `#root > div > div > div.App > div > div.Routes > div > div > div.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-2.css-1r3qf17 > div > div.MuiBox-root > div > span`
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

  // Change moderator settings? Or kick someone
});
