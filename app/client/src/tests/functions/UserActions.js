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
    await this.page.goto(`http://localhost:8080/login`);
    // await page.waitForTimeout(5000);
    await this.page.waitForSelector(".css-ojc9ou"); // Login button

    // Click login button
    await this.page.click(".css-ojc9ou");
    await this.page.waitForNavigation({ waitUntil: "domcontentloaded" });

    // Enter info into fields
    await this.page.type("#user", this.idir);
    await this.page.type("#password", this.password);

    // Click Continue Button
    await this.page.click(`[value="Continue"]`);

    // // Wait for Avatar to appear
    await this.page.waitForSelector(`p.css-kyzvea`);
  }

  // Component Actions
  async openSideMenu() {}

  // Navigation Actions
}

module.exports = { UserActions };
