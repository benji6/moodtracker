import { Browser, Page } from "puppeteer";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";
import {
  createAndSetUpBrowser,
  createPageAndSignIn,
  signIn,
  waitForTransitionToComplete,
} from "./utils";

describe("authed", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  test("user can sign out and sign back in", async () => {
    const navButton = await page.$(SELECTORS.navButton);
    if (!navButton) throw Error("navButton not found");
    await navButton.evaluate((el) => (el as HTMLButtonElement).click());
    const signOutButton = await page.waitForSelector(SELECTORS.signOutButton);
    if (!signOutButton) throw Error("signOutButton not found");
    await waitForTransitionToComplete();
    await signOutButton.evaluate((el) => (el as HTMLButtonElement).click());
    const signOutConfirmButton = await page.waitForSelector(
      SELECTORS.signOutConfirmButton,
    );
    if (!signOutConfirmButton) throw Error("signOutConfirmButton not found");
    await Promise.all([
      page.waitForNavigation(),
      signOutConfirmButton.evaluate((el) => (el as HTMLButtonElement).click()),
    ]);
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
