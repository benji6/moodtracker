import puppeteer from "puppeteer";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn, signIn } from "./utils";

const waitForTransitionToComplete = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300));

describe("authed", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("user can sign out and sign back in", async () => {
    const navButton = (await page.$(SELECTORS.navButton))!;
    await navButton.tap();
    const signOutButton = (await page.waitForSelector(
      SELECTORS.signOutButton
    ))!;
    await waitForTransitionToComplete();
    await signOutButton.tap();
    const signOutConfirmButton = (await page.waitForSelector(
      SELECTORS.signOutConfirmButton
    ))!;
    await Promise.all([page.waitForNavigation(), signOutConfirmButton.tap()]);
    expect(await page.$(SELECTORS.signInLink)).toBeTruthy();

    await waitForTransitionToComplete();

    await signIn(page);
  });

  test("the user can not access routes which are not available to authenticated users", async () => {
    await page.goto(URLS.resetPassowrd);
    await page.waitForSelector(SELECTORS.moodList);
    expect(page.url().replace(/\/$/, "")).toBe(URLS.origin);
    expect(await page.$(SELECTORS.resetPasswordPage)).toBeNull();
    expect(await page.title()).toBe(ROOT_DOCUMENT_TITLE);
  });

  test("user can access protected routes", async () => {
    await page.goto(URLS.statsOverview);
    await page.waitForSelector(SELECTORS.statsOverviewPage);
    expect(page.url()).toBe(URLS.statsOverview);
    expect(await page.title()).toBe("MoodTracker - Stats overview");
  });
});
