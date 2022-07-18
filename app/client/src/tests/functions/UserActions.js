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
    await this.page.goto(`http://localhost:8080/login`);
    await this.page.waitForXPath(`//button[contains(., 'Login')]`); // Login button

    // Click login button
    const [button] = await this.page.$x(`//button[contains(., 'Login')]`);
    if (button) {
      await button.click();
    }
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });

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

  async leaveCommunity(community) {}

  async goToCommunity(community) {
    // Find community title link and click it
    const [communityTitle] = await this.page.$x(
      `//p/b[contains(., '${community}')]`
    );
    if (communityTitle) {
      await communityTitle.click();
    }

    // Wait until Community page
    await this.page.waitForXPath(`//h5[contains(., '${community}')]`); // Community name on community page
  }

  async createCommunity(community) {}

  async createPost(title, body, community = "") {
    await this.page.waitForXPath(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[2]/button`
    ); // try to get first + button

    // try to click first + button
    const [plus] = await this.page.$x(
      `//*[@id="root"]/div/div/div[1]/div/div[1]/div/div/div[1]/div[1]/div/div[2]/button`
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

    await this.page.waitForTimeout(1000); // needs a second for button not to be disabled

    // Try and get button, then click it.
    const [button] = await this.page.$x(
      "//button[contains(., 'Submit')][not(@disabled)]"
    );
    if (button) {
      await button.click();
    }

    // Wait for Avatar to appear
    await this.page.waitForXPath(
      '//button[@aria-label="account of current user"]'
    );
  }

  async goToPost() {}

  async flagPost() {}

  async goToPostersProfile() {}

  async tagPost() {}

  async deletePost() {}

  async addComment() {}

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

  // Profile page actions
  async editAvatar() {}

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

    // Type in bio field
    await this.page.type("#user-bio", input);

    // Get and click save button
    const [button] = await this.page.$x(
      `/html/body/div[2]/div[3]/div/div/div/div[2]/div/button[1]`
    );
    if (button) {
      await button.click();
    }

    // Wait for modal to close
    await this.page.waitForXPath(`//div[@id="root"][@aria-hidden!="true"]`);
  }

  async editInfo() {}

  async editIntrests() {}

  async editSettings() {}
}

module.exports = { UserActions };
