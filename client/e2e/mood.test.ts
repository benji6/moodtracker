import { Browser, ElementHandle, HandleFor, Page } from "puppeteer";
import { SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn } from "./utils";
import { ERRORS } from "../src/constants";

describe("mood", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("adding a mood", () => {
    let descriptionInput: ElementHandle<HTMLInputElement>;
    let submitButton: ElementHandle<HTMLButtonElement>;

    beforeEach(async () => {
      await page.goto(URLS.add);
      await page.waitForSelector(SELECTORS.addMoodPage);

      descriptionInput = (await page.$(
        SELECTORS.descriptionInput,
      )) as ElementHandle<HTMLInputElement>;
      submitButton = (await page.$(
        SELECTORS.addMoodSubmitButton,
      )) as ElementHandle<HTMLButtonElement>;
    });

    test("mood field errors", async () => {
      await submitButton.evaluate((el) => el.click());

      let errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);

      const moodRadioButton = (await page.$(
        SELECTORS.addMoodRadioButton,
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
        `${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`,
      )) as HandleFor<HTMLInputElement>;
      await moodRadioButton.evaluate((el) => el.click());

      errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(0);

      const expectedTime = Math.round(Date.now() / 1e3);

      await submitButton.evaluate((el) => el.click());
      await page.waitForSelector(SELECTORS.moodList);

      expect(page.url()).toBe(URLS.home);

      const moodCardMood = await page.waitForSelector(SELECTORS.moodCardMood);
      if (!moodCardMood) throw Error("moodCardMood not found");
      const moodCardMoodText = await moodCardMood.evaluate(
        (el) => el.textContent,
      );

      expect(moodCardMoodText).toBe(String(MOOD));

      const moodCardTime = await page.$(SELECTORS.moodCardTime);
      if (!moodCardTime) throw Error("moodCardTime not found");
      const moodCardTimeValue = await moodCardTime.evaluate((el) =>
        el.getAttribute("data-time"),
      );
      expect(moodCardTimeValue).toBe(String(expectedTime));
    });

    test("adding a mood with an emoji tag", async () => {
      const MOOD = Math.floor(Math.random() * 11);

      const moodRadioButton = (await page.$(
        `${SELECTORS.addMoodRadioButton}[value="${MOOD}"]`,
      )) as HandleFor<HTMLInputElement>;
      await moodRadioButton.evaluate((el) => el.click());

      await descriptionInput.click({ clickCount: 3 });
      await descriptionInput.type("🧪", { delay: 10 });
      const expectedTime = Math.round(Date.now() / 1e3);

      await descriptionInput.press("Enter");
      await page.waitForSelector(SELECTORS.moodList);

      expect(page.url()).toBe(URLS.home);

      const moodCardMood = await page.waitForSelector(SELECTORS.moodCardMood);
      if (!moodCardMood) throw Error("moodCardMood not found");
      const moodCardMoodText = await moodCardMood.evaluate(
        (el) => el.textContent,
      );
      expect(moodCardMoodText).toBe(String(MOOD));

      const moodCardTags = await page.waitForSelector(SELECTORS.moodCardTags);
      if (!moodCardTags) throw Error("moodCardTags not found");
      const moodCardTagsText = await moodCardTags.evaluate(
        (el) => el.textContent,
      );
      expect(moodCardTagsText).toBe("🧪");

      const moodCardTime = await page.$(SELECTORS.moodCardTime);
      if (!moodCardTime) throw Error("moodCardTime not found");
      const moodCardTimeValue = await moodCardTime.evaluate((el) =>
        el.getAttribute("data-time"),
      );
      expect(moodCardTimeValue).toBe(String(expectedTime));
    });
  });
});
