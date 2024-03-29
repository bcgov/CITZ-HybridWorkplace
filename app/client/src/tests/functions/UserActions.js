import puppeteer from "puppeteer";

class UserActions {
  _idir;
  _password;
  page;

  constructor(idir, password, page) {
    this.idir = idir;
    this.password = password;
    this.page = page;
  }

  // Getters and Setters
  get idir() {
    return this._idir;
  }

  get password() {
    return this._password;
  }

  set idir(idir) {
    this._idir = idir;
  }

  set password(password) {
    this._password = password;
  }

  // Browser/Page Actions (now obsolete)
  async openBrowser(homepage) {
    this.browser = await puppeteer.launch();
    this.page = await this.browser.newPage();
    await this.page.goto(homepage);
  }

  async openBrowserDebug(homepage) {
    this.browser = await puppeteer.launch({ headless: false, slowMo: 100 });
    this.page = await this.browser.newPage();
    await this.page.goto(homepage);
  }

  async closeBrowser() {
    this.browser.close();
  }

  // Page-specific Actions
  async login() {
    // Go to login page
    await this.page.goto(`${process.env.URL}/login`);
    await this.page.waitForXPath(`//button[contains(., 'Login')]`); // Login button

    // Click login button
    const [button] = await this.page.$x(`//button[contains(., 'Login')]`);
    if (button) {
      await button.click();
    }
    await this.page.waitForSelector("#user");

    // Enter info into fields
    await this.page.type("#user", this.idir);
    await this.page.type("#password", this.password);

    // Click Continue Button
    await this.page.click(`[value="Continue"]`);

    // Wait for Avatar to appear
    await this.page.waitForXPath(
      `//button[@aria-label="account of current user"]`
    );
  }

  // Component Actions
  async openSideMenu() {
    // Get and click hamburger menu
    const [button] = await this.page.$x(`//button[@aria-label="open drawer"]`);
    if (button) {
      await button.click();
    }

    // Wait for side menu overlay to confirm Profile load
    await this.page.waitForSelector(`div[role="presentation"]`, {
      timeout: 2000,
    });
  }

  async leaveCommunity(community) {
    this.goToCommunity(community);

    this.page.waitForSelector('data-testid="LogoutOutlinedIcon"');
    this.page.click('data-testid="LogoutOutlinedIcon"');
  }

  async goToCommunity(community) {
    // Find community title link and click it
    const [communityTitle] = await this.page.$x(
      `//p/b[contains(., '${community}')]`
    );
    if (communityTitle) {
      await communityTitle.click();
    }

    // Wait until Community page
    await this.page.waitForXPath(`//h6[contains(., '${community}')]`, {
      timeout: 2000,
    }); // Community name on community page
  }

  async createCommunity(
    community,
    description,
    rules = [],
    tags = [],
    resources = ""
  ) {
    // Assumes user is on community page.
    await this.page.waitForXPath(`//h5[contains(., "Top Communities")]`, {
      timeout: 2000,
    });

    // Click first + button
    const [plus] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[2]/button`
    );
    if (plus) {
      await plus.click();
    }

    // Wait for modal to appear
    await this.page.waitForXPath(`//h2[contains(., "Create Community")]`, {
      timeout: 2000,
    });

    // Type title
    await this.page.type("#create-community-title", community);

    // Type description
    await this.page.type("textarea.w-md-editor-text-input", description);

    // Click Next button
    let [button] = await this.page.$x(
      "//button[contains(., 'Next')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    if (rules.length > 0) {
      // TODO: if rules >0, add rules or tags
    }

    // Click Next button
    [button] = await this.page.$x(
      "//button[contains(., 'Next')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    if (tags.length > 0) {
      // TODO: if tags >0, add rules or tags
    }

    // Click Next button
    [button] = await this.page.$x(
      "//button[contains(., 'Next')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    if (resources.length > 0) {
      await this.page.type("textarea", resources);
    }

    // Click Create button
    // Try and get button, then click it.
    [button] = await this.page.$x(
      "//button[contains(., 'Create')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 2000,
      }
    );
  }

  async createPost(title, body, community = "") {
    await this.page.waitForXPath(`//h5[contains(., "Community Posts")]`, {
      timeout: 2000,
    });

    // try to click first + button
    const [plus] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div[2]/div[1]/div[1]/div/div[2]/button[2]`
    );
    if (plus) {
      await plus.click();
    }

    await this.page.waitForSelector("#add-post-title"); // wait for field to appear

    await this.page.type("#add-post-title", `${title}`); // type in title field
    await this.page.type("textarea.w-md-editor-text-input", `${body}`); // type in body field

    // if no community was provided
    if (community.length !== 0) {
      await this.page.click('div[aria-haspopup="listbox"]'); // open select menu
      await this.page.click(`li[data-value="${community}"]`); // select community
    }

    // await this.page.waitForTimeout(1000); // needs a second for button not to be disabled?

    // Try and get button, then click it.
    const [button] = await this.page.$x(
      "//html/body/div[2]/div[3]/div/div/div/div[3]/div/button[contains(., 'Post')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    // Wait for Post title to appear
    await this.page.waitForXPath(`//h6[contains(., "${title}")]`);
  }

  async goToPost(postTitle) {
    // Try and get button, then click it.
    const [post] = await this.page.$x(`//h6[contains(., "${postTitle}")]`);
    if (post) {
      await post.click();
    }

    // Wait for post page (can see Comments area)
    await this.page.waitForXPath(`//h6[contains(., "Comments")]`);
  }

  async flagPost() {}

  async goToPostersProfile() {}

  async tagPost() {}

  async deletePost() {}

  // Assumed on post page
  async addComment(comment) {
    // Find and click Add Comment
    const [add] = await this.page.$x(`//button[contains(., "+ Add Comment")]`);
    if (add) {
      await add.click();
    }

    // Type comment
    await this.page.type(`textarea[id*=mui-]`, comment);
    //*[@id="mui-13"]

    // Click Comment
    const [button] = await this.page.$x(`//button[contains(., "Comment")]`);
    if (button) {
      await button.click();
    }

    // Wait for comment to appear
    await this.page.waitForXPath(`//p[contains(., "${comment}")]`);
  }

  async upvoteComment() {}

  async downvoteComment() {}

  async replyToComment() {}

  async flagComment() {}

  async deleteComment() {}

  // Navigation Actions

  async goToHomeByLogo() {
    // Try and get button, then click it.
    const [button] = await this.page.$x(
      "//*[@id='root']/div/div/header/div/div[1]/button/span[1]/img"
    );
    if (button) {
      await button.click();
    }

    // Wait for Top Post bar to appear
    await this.page.waitForXPath(`//h5[contains(., "Top Posts")]`);
  }

  async goToHomeByFooter() {
    // Try and get button, then click it.
    const [button] = await this.page.$x(`//a[contains(., "Home")]`);
    if (button) {
      await button.click();
    }

    // Wait for Top Post bar to appear
    await this.page.waitForXPath(`//h5[contains(., "Top Posts")]`);
  }

  async goToHomeBySidemenu() {
    await this.openSideMenu();

    // Get and click Home link
    const [button] = await this.page.$x(`//span[contains(., "Home")]`);
    if (button) {
      await button.click();
    }

    // Wait for Top Post bar to appear
    await this.page.waitForXPath(`//h5[contains(., "Top Posts")]`);
  }

  async goToProfileByAvatar() {
    // Ensure avatar is visible
    await this.page.waitForXPath(
      '//button[@aria-label="account of current user"]',
      {
        timeout: 2000,
      }
    );

    // Get and click avatar
    const [button] = await this.page.$x(
      `//button[@aria-label="account of current user"]`
    );
    if (button) {
      await button.click();
    }

    // Wait for Settings cog to confirm Profile load
    await this.page.waitForSelector(`svg[data-testid="SettingsRoundedIcon"]`, {
      timeout: 2000,
    });
  }

  async goToProfileBySidemenu() {
    await this.openSideMenu();

    // Get and click profile link
    const [button] = await this.page.$x(`//span[contains(., "Profile")]`);
    if (button) {
      await button.click();
    }

    // Wait for Settings cog to confirm Profile load
    await this.page.waitForSelector(`svg[data-testid="SettingsRoundedIcon"]`, {
      timeout: 2000,
    });
  }

  async goToCommunitiesBySidemenu() {
    await this.openSideMenu();

    // Get and click profile link
    const [button] = await this.page.$x(`//span[contains(., "Communities")]`);
    if (button) {
      await button.click();
    }

    // Wait for Settings cog to confirm Profile load
    await this.page.waitForXPath(`//h5[contains(., "Top Communities")]`, {
      timeout: 2000,
    });
  }

  async search(contents) {
    await this.page.type("#searchBar", contents);
    await this.page.keyboard.press("Enter");
  }

  // Profile page actions
  async editAvatar(colour, type, optionalColour = "") {
    // Get and click avatar
    const [avatar] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/button`,
      {
        timeout: 2000,
      }
    );
    if (avatar) {
      await avatar.click();
    }

    // Wait for modal
    await this.page.waitForXPath(`//h2[contains(., "Edit Avatar")]`);

    // Select colour
    const [colourButton] = await this.page.$x(`//input[@value="${colour}"]`);
    if (colourButton) {
      await colourButton.click();
    }

    // Set gradient checkbox
    const checkbox = await this.page.$(`input[type="checkbox"]`);
    const checkboxIsChecked = await (
      await checkbox.getProperty("checked")
    ).jsonValue();

    // If it is checked, but no second colour was passed, turn gradient off
    if (checkboxIsChecked === true && optionalColour.length === 0)
      await this.page.click(`input[type="checkbox"]`);

    // If it is not checked, but there is an second colour, turn gradient on
    if (checkboxIsChecked === false && optionalColour.length > 0)
      await this.page.click(`input[type="checkbox"]`);

    // Put in second colour
    const [colourButton2] = await this.page.$x(
      `//html/body/div[2]/div[3]/div/div/div/div[2]/div[3]/span/input[@value="${optionalColour}"]`
    );
    if (colourButton2) {
      await colourButton2.click();
    }

    // Select type
    const [typeButton] = await this.page.$x(`//input[@value="${type}"]`);
    if (typeButton) {
      await typeButton.click();
    }

    // Get and click save button
    const [button] = await this.page.$x(`//button[contains(., 'Save')]`);
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 2000,
      }
    );
  }

  async editBio(input) {
    // Get and click pencil
    const [pencil] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[2]/div[1]/div/button`
    );
    if (pencil) {
      await pencil.click();
    }

    // Wait for modal
    await this.page.waitForXPath(`//h2[contains(., "Edit User Bio")]`);

    // Remove existing bio
    const bioValue = await this.page.$eval("#user-bio", (el) => el.value);
    await this.page.focus("#user-bio");
    for (let i = 0; i < bioValue.length; i++) {
      await this.page.keyboard.press("ArrowRight");
    }

    for (let i = 0; i < bioValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }

    // Type in bio field
    await this.page.type("#user-bio", input);

    // Get and click save button
    const [button] = await this.page.$x(`//button[contains(., 'Save')]`);
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 2000,
      }
    );
  }

  async editInfo(firstName, lastName, title, ministry) {
    // Click edit pencil
    const [pencil] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[1]/div/button`
    );
    if (pencil) {
      await pencil.click();
    }

    // Wait for modal
    await this.page.waitForXPath(`//h2[contains(., "Edit User Info")]`);

    // Clear fields
    const firstNameValue = await this.page.$eval(
      "#user-name",
      (el) => el.value
    );
    await this.page.focus("#user-name");
    for (let i = 0; i < firstNameValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }

    const lastNameValue = await this.page.$eval(
      "#user-lastName",
      (el) => el.value
    );
    await this.page.focus("#user-lastName");
    for (let i = 0; i < lastNameValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }

    const titleValue = await this.page.$eval("#user-title", (el) => el.value);
    await this.page.focus("#user-title");
    for (let i = 0; i < titleValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }

    const ministryValue = await this.page.$eval(
      "#user-ministry",
      (el) => el.value
    );
    await this.page.focus("#user-ministry");
    for (let i = 0; i < ministryValue.length; i++) {
      await this.page.keyboard.press("Backspace");
    }

    // Fill fields
    await this.page.type("#user-name", firstName);
    await this.page.type("#user-lastName", lastName);
    await this.page.type("#user-title", title);
    await this.page.type("#user-ministry", ministry);

    // Click save
    const [button] = await this.page.$x(`//button[contains(., 'Save')]`);
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 2000,
      }
    );
  }

  async editInterests(input) {
    // Click edit pencil
    const [pencil] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[2]/div[1]/button`
    );
    if (pencil) {
      await pencil.click();
    }

    // Loop the following: type input, hit enter
    for (let i = 0; i < input.length; i++) {
      await this.page.type("#tag-input", input[i]);
      await this.page.keyboard.press("Enter");
    }

    // Click save
    const [button] = await this.page.$x(`//button[contains(., 'Save')]`);
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 3000,
      }
    );
  }

  async editSettings(notification, theme) {
    // Click edit gear
    const [gear] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[4]/button`
    );
    if (gear) {
      await gear.click();
    }

    // Wait for modal
    await this.page.waitForXPath(`//input[@value="${notification}"]`);

    // Choose setting for notifications
    const [radio] = await this.page.$x(`//input[@value="${notification}"]`);
    if (radio) {
      await radio.click();
    }

    // Select Theme
    await this.page.click('div[aria-labelledby="darkmode-preference-label"]'); // open select menu
    await this.page.click(`li[data-value="${theme}"]`); // select li

    // Click save
    const [button] = await this.page.$x(`//button[contains(., 'Save')]`);
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForFunction(
      `document.getElementById("root").ariaHidden != "true"`,
      {
        timeout: 2000,
      }
    );
  }
}

// Easy to check xpaths with this in console
// document.evaluate(`//xpath`, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

module.exports = { UserActions };
