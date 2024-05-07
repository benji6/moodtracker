import { Browser, Page } from "puppeteer";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createAndSetUpPage } from "./utils";

describe("unauthed", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createAndSetUpPage(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("the user can access routes which are not available to authenticated users", async () => {
    await page.goto(URLS.resetPassowrd);
    await page.waitForSelector(SELECTORS.resetPasswordPage);
    expect(page.url()).toBe(URLS.resetPassowrd);
    expect(await page.title()).toBe("MoodTracker - Reset password");
  });

  test("the user can not access protected routes", async () => {
    await page.goto(URLS.add);
    await page.waitForSelector(SELECTORS.signInLink);
    expect(page.url().replace(/\/$/, "")).toBe(URLS.origin);
    expect(await page.$(SELECTORS.eventAddPage)).toBeNull();
    expect(await page.title()).toBe(ROOT_DOCUMENT_TITLE);
  });
});
