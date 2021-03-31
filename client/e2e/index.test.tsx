import puppeteer from "puppeteer";
import { TEST_IDS } from "../src/constants";

const ORIGIN = "http://localhost:1234";
const ADD_URL = `${ORIGIN}/add`;
const RESET_PASSWORD_URL = `${ORIGIN}/reset-password`;
const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD!;

const SELECTORS = {} as typeof TEST_IDS;
for (const [k, v] of Object.entries(TEST_IDS))
  SELECTORS[k as keyof typeof TEST_IDS] = `[data-test-id="${v}"]`;

describe("e2e", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const tapAndNavigate = async (el: puppeteer.ElementHandle<Element>) => {
    const [response] = await Promise.all([page.waitForNavigation(), el.tap()]);
    return response;
  };

  beforeAll(async () => {
    browser = await puppeteer.launch({
      defaultViewport: { height: 640, width: 360 },
    });
    page = await browser.newPage();
    page.setDefaultTimeout(3e3);
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    await page.goto(ORIGIN);
  });

  describe("when the user is not signed in", () => {
    test("the user can access routes which are not available to authenticated users", async () => {
      await page.goto(RESET_PASSWORD_URL);
      await page.waitForSelector(SELECTORS.resetPasswordPage);
      expect(page.url()).toBe(RESET_PASSWORD_URL);
    });

    test("the user can not access protected routes", async () => {
      await page.goto(ADD_URL);
      await page.waitForSelector(SELECTORS.signInLink);
      expect(page.url().replace(/\/$/, "")).toBe(ORIGIN);
      expect(await page.$(SELECTORS.addMoodPage)).toBeNull();
    });
  });

  describe("when the user is signed in", () => {
    beforeAll(async () => {
      const signInLink = (await page.waitForSelector(SELECTORS.signInLink))!;
      await page.waitForTimeout(100);
      await tapAndNavigate(signInLink);

      const emailInput = (await page.waitForSelector('[type="email"]'))!;
      await emailInput.type(TEST_USER_EMAIL);
      const passwordInput = (await page.$('[type="password"]'))!;
      await passwordInput.type(TEST_USER_PASSWORD);
      await Promise.all([
        page.waitForNavigation(),
        passwordInput.press("Enter"),
      ]);

      await page.waitForSelector(SELECTORS.moodList);
    });

    afterAll(async () => {
      const navButton = (await page.$(SELECTORS.navButton))!;
      await navButton.tap();

      const signOutButton = (await page.waitForSelector(
        SELECTORS.signOutButton
      ))!;
      await page.waitForTimeout(100);
      await signOutButton.tap();
      const signOutConfirmButton = (await page.waitForSelector(
        SELECTORS.signOutConfirmButton
      ))!;
      await tapAndNavigate(signOutConfirmButton);

      expect(await page.$(SELECTORS.signInLink)).toBeTruthy();
    });

    test("the user can not access routes which are not available to authenticated users", async () => {
      await page.goto(RESET_PASSWORD_URL);
      await page.waitForSelector(SELECTORS.moodList);
      expect(page.url().replace(/\/$/, "")).toBe(ORIGIN);
      expect(await page.$(SELECTORS.resetPasswordPage)).toBeNull();
    });

    test("user can access protected routes", async () => {
      await page.goto(ADD_URL);
      await page.waitForSelector(SELECTORS.addMoodPage);
      expect(page.url()).toBe(ADD_URL);
    });
  });
});
