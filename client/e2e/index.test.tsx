import puppeteer from "puppeteer";

const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD!;

describe("e2e", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      defaultViewport: { height: 640, width: 360 },
    });
    page = await browser.newPage();
    await page.goto("http://localhost:1234");
  });

  afterEach(async () => {
    await browser.close();
  });

  test("user can sign in and sign out", async () => {
    const signInLink = (await page.$('[href="/sign-in"]'))!;
    await signInLink.tap();

    const emailInput = (await page.waitForSelector('[type="email"]'))!;
    await emailInput.type(TEST_USER_EMAIL);

    const passwordInput = (await page.$('[type="password"]'))!;
    await passwordInput.type(TEST_USER_PASSWORD);
    await passwordInput.press("Enter");

    await page.waitForSelector('[data-test-id="mood-list"]');

    const menuButton = (await page.$('[data-test-id="menu-button"]'))!;
    await menuButton.tap();

    // seems like a very high timeout but it starts to flake if we reduce it
    await page.waitForTimeout(4000);

    const signOutButton = (await page.$('[data-test-id="sign-out-button"]'))!;
    await signOutButton.click();
    const signOutConfirmButton = (await page.waitForSelector(
      '[data-test-id="sign-out-confirm-button"]'
    ))!;
    await signOutConfirmButton.tap();

    expect(await page.$('[href="/sign-in"]')).toBeTruthy();
  });
});
