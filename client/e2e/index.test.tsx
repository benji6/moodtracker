import puppeteer from "puppeteer";

const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD!;

describe("e2e", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const tapAndNavigate = async (el: puppeteer.ElementHandle<Element>) => {
    const [response] = await Promise.all([page.waitForNavigation(), el.tap()]);
    return response;
  };

  beforeEach(async () => {
    browser = await puppeteer.launch({
      defaultViewport: { height: 640, width: 360 },
    });
    page = await browser.newPage();
    page.setDefaultTimeout(3e3);
    await page.goto("http://localhost:1234");
  });

  afterEach(async () => {
    await browser.close();
  });

  test("user can sign in and sign out", async () => {
    const signInLink = (await page.waitForSelector(
      '[data-test-id="sign-in-link"]'
    ))!;
    await page.waitForTimeout(100);
    await tapAndNavigate(signInLink);

    const emailInput = (await page.waitForSelector('[type="email"]'))!;
    await emailInput.type(TEST_USER_EMAIL);
    const passwordInput = (await page.$('[type="password"]'))!;
    await passwordInput.type(TEST_USER_PASSWORD);
    await Promise.all([page.waitForNavigation(), passwordInput.press("Enter")]);

    await page.waitForSelector('[data-test-id="mood-list"]');
    const navButton = (await page.$('[data-test-id="nav-button"]'))!;
    await navButton.tap();

    const signOutButton = (await page.waitForSelector(
      '[data-test-id="sign-out-button"]'
    ))!;
    await page.waitForTimeout(100);
    await signOutButton.tap();
    const signOutConfirmButton = (await page.waitForSelector(
      '[data-test-id="sign-out-confirm-button"]'
    ))!;
    await tapAndNavigate(signOutConfirmButton);

    expect(await page.$('[href="/sign-in"]')).toBeTruthy();
  });
});
