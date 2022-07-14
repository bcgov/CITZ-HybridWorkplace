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
    await this.page.waitForSelector(".css-ojc9ou"); // Login button

    // Click login button
    await this.page.click(".css-ojc9ou");
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });

    // Enter info into fields
    await this.page.type("#user", this.idir);
    await this.page.type("#password", this.password);

    // Click Continue Button
    await this.page.click(`[value="Continue"]`);

    // Wait for Avatar to appear
    await this.page.waitForSelector(`p.css-kyzvea`);
  }

  // Component Actions
  async openSideMenu() {}

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
    await this.page.waitForSelector(".css-9mgnpw"); // Community name on community page
  }

  async createCommunity(community) {}

  async createPost(title, body, community = "") {
    await this.page.waitForSelector("button.css-rxr26v"); // try to get first + button
    await this.page.click("button.css-rxr26v"); // try to click first + button
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
    await this.page.waitForSelector(`p.css-kyzvea`);
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
      "//button/span/img[@src='http://localhost:8080/static/media/BCLogo.0490750b1c69a5f084115e9422336dce.svg']"
    );
    if (button) {
      await button.click();
    }

    // Wait for Avatar to appear
    await this.page.waitForXPath(`//h5[contains(., 'Top Posts')]`);
  }

  async goToProfileByAvatar() {}
}

module.exports = { UserActions };
