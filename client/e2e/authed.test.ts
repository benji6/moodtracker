import puppeteer from "puppeteer";
import { ERRORS } from "../src/constants";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn, signIn } from "./utils";

const waitForTransitionToComplete = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300));

describe("authed", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  const tapAndNavigate = async (
    el: puppeteer.ElementHandle<Element>,
    waitForOptions?: puppeteer.WaitForOptions
  ) => {
    const [response] = await Promise.all([
      page.waitForNavigation(waitForOptions),
      el.tap(),
    ]);
    return response;
  };

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
    await tapAndNavigate(signOutConfirmButton);
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

  describe("meditation", () => {
    beforeEach(async () => {
      await page.goto(URLS.meditation);
      await page.waitForSelector(SELECTORS.meditatePage);
    });

    test("using a preset time", async () => {
      const button = (await page.$(
        `${SELECTORS.meditationPresetTimeButton}[data-minutes="10"]`
      ))!;
      tapAndNavigate(button);
      await page.waitForSelector(SELECTORS.meditatePage);

      await waitForTransitionToComplete();

      expect(page.url()).toBe(`${URLS.meditationTimer}?t=600`);
    });

    test("using a custom time", async () => {
      let error = await page.$('[data-eri-id="field-error"]');
      expect(error).toBeNull();

      const customTimeInput = (await page.$(
        SELECTORS.meditationCustomTimeInput
      ))!;
      await customTimeInput.press("Enter");

      error = (await page.$('[data-eri-id="field-error"]'))!;
      expect(error).not.toBeNull();
      let errorMessage = await error!.evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);

      await customTimeInput.type("6e1");
      await customTimeInput.press("Enter");

      error = (await page.$('[data-eri-id="field-error"]'))!;
      expect(error).not.toBeNull();
      errorMessage = await error.evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.integer);

      await customTimeInput.click({ clickCount: 3 });
      await customTimeInput.type("181");
      await customTimeInput.press("Enter");

      error = (await page.$('[data-eri-id="field-error"]'))!;
      expect(error).not.toBeNull();
      errorMessage = await error.evaluate((el) => el.textContent);
      expect(errorMessage).toBe("The maximum allowed time is 180 minutes");

      await customTimeInput.click({ clickCount: 3 });
      await customTimeInput.type("60");
      await customTimeInput.press("Enter");

      error = await page.$('[data-eri-id="field-error"]');
      expect(error).toBeNull();

      await page.waitForSelector(SELECTORS.meditationTimerPage);

      expect(page.url()).toBe(`${URLS.meditationTimer}?t=3600`);
    });
  });
});
