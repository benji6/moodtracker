import { Browser, ElementHandle, Page } from "puppeteer";
import { SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn } from "./utils";
import { ERRORS } from "../src/constants";

describe("push-ups", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("adding push-ups", () => {
    let input: ElementHandle<HTMLInputElement>;
    let submitButton: ElementHandle<HTMLButtonElement>;

    beforeEach(async () => {
      await page.goto(URLS.pushUpsAdd);
      await page.waitForSelector(SELECTORS.pushUpsAddPage);

      input = (await page.$(
        SELECTORS.pushUpsValueInput,
      )) as ElementHandle<HTMLInputElement>;
      submitButton = (await page.$(
        SELECTORS.pushUpsAddSubmitButton,
      )) as ElementHandle<HTMLButtonElement>;
    });

    test("no value", async () => {
      await submitButton.evaluate((el) => el.click());

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);
    });

    test("text instead of number", async () => {
      await input.type("a", { delay: 10 });
      await input.press("Enter");

      const value = await page.evaluate((x) => x.value, input);
      expect(value).toBe("");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.required);
    });

    test("range overflow", async () => {
      await input.type("1001", { delay: 10 });
      await input.press("Enter");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.rangeOverflow);
    });

    test("range underflow", async () => {
      await input.type("0", { delay: 10 });
      await input.press("Enter");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.rangeUnderflow);
    });

    test("Not an integer", async () => {
      await input.type("20.1", { delay: 10 });
      await input.press("Enter");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.integer);
    });

    test("valid", async () => {
      const testValue = "20";
      await input.type(testValue, { delay: 10 });

      const expectedTime = Math.round(Date.now() / 1e3);

      await submitButton.evaluate((el) => el.click());

      expect(page.url()).toBe(URLS.pushUpsLog);

      const cardValue = await page.waitForSelector(SELECTORS.pushUpsCardValue);
      if (!cardValue) throw Error("Card value not found");
      const textContent = await cardValue.evaluate((el) => el.textContent);

      expect(textContent).toBe(`${testValue} push-ups`);

      const cardTime = await page.$(SELECTORS.pushUpsCardTime);
      if (!cardTime) throw Error("Card time not found");
      const timeValue = await cardTime.evaluate((el) =>
        el.getAttribute("data-time"),
      );
      expect(timeValue).toBe(String(expectedTime));
    });

    test("1 push-up", async () => {
      const testValue = "1";
      await input.type(testValue, { delay: 10 });
      await submitButton.evaluate((el) => el.click());
      expect(page.url()).toBe(URLS.pushUpsLog);
      const cardValue = await page.waitForSelector(SELECTORS.pushUpsCardValue);
      if (!cardValue) throw Error("Card value not found");
      const textContent = await cardValue.evaluate((el) => el.textContent);
      expect(textContent).toBe("1 push-up");
    });
  });
});
