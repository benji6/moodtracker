import { Browser, Page, ElementHandle } from "puppeteer";
import { ERRORS } from "../src/constants";
import { SELECTORS, URLS } from "./constants";
import { createAndSetUpBrowser, createPageAndSignIn } from "./utils";

describe("weight", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await createAndSetUpBrowser();
    page = await createPageAndSignIn(browser);
  });

  afterAll(async () => {
    await browser.close();
  });

  describe("adding a weight", () => {
    let input: ElementHandle<HTMLInputElement>;
    let submitButton: ElementHandle<HTMLButtonElement>;

    beforeEach(async () => {
      await page.goto(URLS.weightAdd);
      await page.waitForSelector(SELECTORS.weightAddPage);

      input = ((await page.$(
        SELECTORS.weightValueInput,
      )) as ElementHandle<HTMLInputElement>)!;
      submitButton = ((await page.$(
        SELECTORS.weightAddSubmitButton,
      )) as ElementHandle<HTMLButtonElement>)!;
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
      await input.type("650.1", { delay: 10 });
      await input.press("Enter");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.rangeOverflow);
    });

    test("range underflow", async () => {
      await input.type("-0.01", { delay: 10 });
      await input.press("Enter");

      const errors = await page.$$('[data-eri-id="field-error"]');
      expect(errors).toHaveLength(1);

      const errorMessage = await errors[0].evaluate((el) => el.textContent);
      expect(errorMessage).toBe(ERRORS.rangeUnderflow);
    });

    test("valid", async () => {
      const weightTestValue = "70";
      await input.type(weightTestValue, { delay: 10 });

      const expectedTime = Math.round(Date.now() / 1e3);

      await submitButton.evaluate((el) => el.click());

      expect(page.url()).toBe(URLS.weightLog);

      const weightCardValue = await page.waitForSelector(
        SELECTORS.weightCardValue,
      );
      const weightText = await weightCardValue!.evaluate(
        (el) => el.textContent,
      );

      expect(weightText).toBe(`${weightTestValue}kg`);

      const cardTime = await page.$(SELECTORS.weightCardTime);
      const timeValue = await cardTime!.evaluate((el) =>
        el.getAttribute("data-time"),
      );
      expect(timeValue).toBe(String(expectedTime));
    });
  });
});
