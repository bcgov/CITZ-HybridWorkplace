import puppeteer from "puppeteer";

class UserActions {
  _idir;
  _password;
  browser;
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

  // Browser/Page Actions
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
    await this.page.goto(`${this.homepage}/login`);
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });

    // Click login button
    await this.page.click('button[tabindex="0"]');
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });

    // Enter info into fields
    await this.page.type("#user", this.idir);
    await this.page.type("#password", this.password);

    // Click Continue
    await this.page.click(`[value="Continue"]`);

    // Check result
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });
  }

  // Component Actions
  async openSideMenu() {}

  // Navigation Actions
}

module.exports = { UserActions };
