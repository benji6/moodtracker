import puppeteer, { HandleFor } from "puppeteer";
import { ERRORS } from "../src/constants";
import { SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn } from "./utils";

describe("mood", () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("adding a mood", () => {
    let descriptionInput: puppeteer.ElementHandle<HTMLInputElement>;
    let submitButton: puppeteer.ElementHandle<HTMLButtonElement>;

    beforeEach(async () => {
      await page.goto(URLS.add);
      await page.waitForSelector(SELECTORS.addMoodPage);

      descriptionInput = ((await page.$(
        SELECTORS.descriptionInput
      )) as puppeteer.ElementHandle<HTMLInputElement>)!;
      submitButton = ((await page.$(
        SELECTORS.addMoodSubmitButton
      )) as puppeteer.ElementHandle<HTMLButtonElement>)!;
    });

    test("mood field errors", async () => {
      await submitButton.evaluate((el) => el.click());

      let errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);

      const moodRadioButton = (await page.$(
        SELECTORS.addMoodRadioButton
      )) as HandleFor<HTMLInputElement>;
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

    test("adding a mood with only a mood value", async () => {
      const MOOD = Math.floor(Math.random() * 11);

      await submitButton.evaluate((el) => el.click());

      let errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);

      const moodRadioButton = (await page.$(
        `${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`
      )) as HandleFor<HTMLInputElement>;
      await moodRadioButton.evaluate((el) => el.click());

      errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(0);

      const expectedTime = Math.round(Date.now() / 1e3);

      await submitButton.evaluate((el) => el.click());
      await page.waitForSelector(SELECTORS.moodList);

      expect(page.url()).toBe(URLS.home);

      const moodCardMood = await page.waitForSelector(SELECTORS.moodCardMood);
      const moodCardMoodText = await moodCardMood!.evaluate(
        (el) => el.textContent
      );

      expect(moodCardMoodText).toBe(String(MOOD));

      const moodCardTime = await page.$(SELECTORS.moodCardTime);
      const moodCardTimeValue = await moodCardTime!.evaluate((el) =>
        el.getAttribute("data-time")
      );
      expect(moodCardTimeValue).toBe(String(expectedTime));
    });
  });
});
