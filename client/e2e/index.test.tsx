import puppeteer from "puppeteer";
import { ERRORS, TEST_IDS } from "../src/constants";

class URLS {
  static readonly origin = "http://localhost:1234";

  static readonly add = `${URLS.origin}/add`;
  static readonly meditate = `${URLS.origin}/meditate`;
  static readonly meditationTimer = `${URLS.meditate}/timer`;
  static readonly resetPassowrd = `${URLS.origin}/reset-password`;
  static readonly statsOverview = `${URLS.origin}/stats`;
}

const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD!;

const SELECTORS = {} as { [k in keyof typeof TEST_IDS]: string };
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
    await page.goto(URLS.origin);
  });

  describe("when the user is not signed in", () => {
    test("the user can access routes which are not available to authenticated users", async () => {
      await page.goto(URLS.resetPassowrd);
      await page.waitForSelector(SELECTORS.resetPasswordPage);
      expect(page.url()).toBe(URLS.resetPassowrd);
    });

    test("the user can not access protected routes", async () => {
      await page.goto(URLS.add);
      await page.waitForSelector(SELECTORS.signInLink);
      expect(page.url().replace(/\/$/, "")).toBe(URLS.origin);
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
      await page.goto(URLS.resetPassowrd);
      await page.waitForSelector(SELECTORS.moodList);
      expect(page.url().replace(/\/$/, "")).toBe(URLS.origin);
      expect(await page.$(SELECTORS.resetPasswordPage)).toBeNull();
    });

    test("user can access protected routes", async () => {
      await page.goto(URLS.statsOverview);
      await page.waitForSelector(SELECTORS.statsOverviewPage);
      expect(page.url()).toBe(URLS.statsOverview);
    });

    describe("adding a mood", () => {
      let descriptionInput: puppeteer.ElementHandle<HTMLInputElement>;
      let submitButton: puppeteer.ElementHandle<HTMLButtonElement>;

      beforeEach(async () => {
        await page.goto(URLS.add);
        await page.waitForSelector(SELECTORS.addMoodPage);

        descriptionInput = (await page.$(SELECTORS.descriptionInput))!;
        submitButton = (await page.$(SELECTORS.addMoodSubmitButton))!;
      });

      test("mood field errors", async () => {
        await submitButton.evaluate((el) => el.click());

        let errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(1);

        const errorMessage = await errors[0].evaluate((el) => el.textContent);
        expect(errorMessage).toBe(ERRORS.required);

        const moodRadioButton = (await page.$(SELECTORS.addMoodRadioButton))!;
        await moodRadioButton.evaluate((el) => el.click());

        errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(0);
      });

      test("description field errors", async () => {
        let errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(0);

        await descriptionInput.type('hello"world', { delay: 10 });
        await descriptionInput.press("Enter");

        errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(2);
        const errorMessage = await errors[1].evaluate((el) => el.textContent);
        expect(errorMessage).toBe(ERRORS.specialCharacters);

        await descriptionInput.click({ clickCount: 3 });
        await descriptionInput.type("hello world", { delay: 10 });
        await descriptionInput.press("Enter");
        errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(1);
      });
    });

    describe("meditation", () => {
      beforeEach(async () => {
        await page.goto(URLS.meditate);
        await page.waitForSelector(SELECTORS.meditatePage);
      });

      test("using a preset time", async () => {
        const button = (await page.$(
          `${SELECTORS.meditationPresetTimeButton}[data-minutes="10"]`
        ))!;
        tapAndNavigate(button);
        await page.waitForSelector(SELECTORS.meditatePage);
        await page.waitForTimeout(100);

        expect(page.url()).toBe(`${URLS.meditationTimer}?t=600`);
      });

      describe("using a custom time", async () => {
        let errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(0);

        const customTimeInput = (await page.$(
          SELECTORS.meditationCustomTimeInput
        ))!;
        await customTimeInput.type("6e1");
        await customTimeInput.press("Enter");

        errors = await page.$$('[data-eri-id="field-error"]');
        expect(errors).toHaveLength(1);

        const errorMessage = await errors[0].evaluate((el) => el.textContent);
        expect(errorMessage).toBe(ERRORS.specialCharacters);

        await customTimeInput.click({ clickCount: 3 });
        await customTimeInput.type("60");
        await customTimeInput.press("Enter");
        await page.waitForSelector(SELECTORS.meditatePage);
        await page.waitForTimeout(100);

        expect(page.url()).toBe(`${URLS.meditationTimer}?t=3600`);
      });
    });
  });
});
