import puppeteer, { ElementHandle } from "puppeteer";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";

const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL!;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD!;

export const createAndSetUpBrowser = (): Promise<puppeteer.Browser> =>
  puppeteer.launch({
    defaultViewport: { height: 640, width: 360 },
  });

export const createAndSetUpPage = async (
  browser: puppeteer.Browser
): Promise<puppeteer.Page> => {
  const page = await browser.newPage();
  page.setDefaultTimeout(3e3);
  await page.goto(URLS.origin);
  expect(await page.title()).toBe(ROOT_DOCUMENT_TITLE);
  return page;
};

export const createPageAndSignIn = async (
  browser: puppeteer.Browser
): Promise<puppeteer.Page> => {
  const page = await createAndSetUpPage(browser);
  await signIn(page);
  return page;
};

export const signIn = async (page: puppeteer.Page): Promise<void> => {
  const signInLink = (await page.waitForSelector(
    SELECTORS.signInLink
  )) as ElementHandle<HTMLInputElement>;
  await Promise.all([
    page.waitForNavigation(),
    signInLink.evaluate((el) => el.click()),
  ]);

  const emailInput = (await page.waitForSelector(
    '[type="email"]'
  )) as ElementHandle<HTMLInputElement>;
  await emailInput.type(TEST_USER_EMAIL, { delay: 10 });
  expect(await emailInput.evaluate((el) => el.value)).toBe(TEST_USER_EMAIL);

  const passwordInput = (await page.$(
    '[type="password"]'
  )) as ElementHandle<HTMLInputElement>;
  await passwordInput.type(TEST_USER_PASSWORD, { delay: 10 });
  expect(await passwordInput.evaluate((el) => el.value)).toBe(
    TEST_USER_PASSWORD
  );

  await Promise.all([
    page.waitForNavigation({ timeout: 5e3 }),
    passwordInput.press("Enter"),
  ]);

  await page.waitForSelector(SELECTORS.deviceSpecificSettingsDialog);
  const closeButton = (await page.$(
    ".close-button"
  )) as ElementHandle<HTMLButtonElement>;
  await closeButton.evaluate((el) => el.click());
  await page.waitForSelector(SELECTORS.moodList);
};
