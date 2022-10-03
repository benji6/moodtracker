import puppeteer from "puppeteer";
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
  const signInLink = (await page.waitForSelector(SELECTORS.signInLink))!;
  await Promise.all([page.waitForNavigation(), signInLink.tap()]);

  const emailInput = (await page.waitForSelector('[type="email"]'))!;
  await emailInput.type(TEST_USER_EMAIL);
  const passwordInput = (await page.$('[type="password"]'))!;
  await passwordInput.type(TEST_USER_PASSWORD);

  await Promise.all([
    page.waitForNavigation({ timeout: 5e3 }),
    passwordInput.press("Enter"),
  ]);

  await page.waitForSelector(SELECTORS.deviceSpecificSettingsDialog);
  const closeButton = (await page.$(".close-button"))!;
  await closeButton.tap();
  await page.waitForSelector(SELECTORS.moodList);
};
