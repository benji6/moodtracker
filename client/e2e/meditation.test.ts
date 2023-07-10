import { Browser, Page } from "puppeteer";
import { ERRORS } from "../src/constants";
import { SELECTORS, URLS } from "./constants";
import {
  createAndSetUpBrowser,
  createPageAndSignIn,
  waitForTransitionToComplete,
} from "./utils";

describe("meditation", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("meditation", () => {
    beforeEach(async () => {
      await page.goto(URLS.meditation);
      await page.waitForSelector(SELECTORS.meditatePage);
    });

    test("using a preset time", async () => {
      const button = (await page.$(
        `${SELECTORS.meditationPresetTimeButton}[data-minutes="10"]`,
      ))!;
      button.tap();
      await page.waitForSelector(SELECTORS.meditatePage);

      await waitForTransitionToComplete();

      expect(page.url()).toBe(`${URLS.meditationTimer}?t=600`);
    });

    test("using a custom time", async () => {
      let error = await page.$('[data-eri-id="field-error"]');
      expect(error).toBeNull();

      const customTimeInput = (await page.$(
        SELECTORS.meditationCustomTimeInput,
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
