import { Browser, ElementHandle, Page, launch } from "puppeteer";
import { ROOT_DOCUMENT_TITLE, SELECTORS, URLS } from "./constants";

const TEST_USER_EMAIL = process.env.MOODTRACKER_TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.MOODTRACKER_TEST_USER_PASSWORD;

if (!TEST_USER_EMAIL)
  throw Error("TEST_USER_EMAIL environment variable not set");
if (!TEST_USER_PASSWORD)
  throw Error("TEST_USER_PASSWORD environment variable not set");

export const createAndSetUpBrowser = (): Promise<Browser> =>
  launch({
    defaultViewport: { height: 640, width: 360 },
  });

export const createAndSetUpPage = async (browser: Browser): Promise<Page> => {
  const page = await browser.newPage();
  page.setDefaultTimeout(3e3);
  await page.goto(URLS.origin);
  expect(await page.title()).toBe(ROOT_DOCUMENT_TITLE);
  return page;
};

export const createPageAndSignIn = async (browser: Browser): Promise<Page> => {
  const page = await createAndSetUpPage(browser);
  await signIn(page);
  return page;
};

export const signIn = async (page: Page): Promise<void> => {
  const signInLink = (await page.waitForSelector(
    SELECTORS.signInLink,
  )) as ElementHandle<HTMLInputElement>;
  await Promise.all([
    page.waitForNavigation(),
    signInLink.evaluate((el) => el.click()),
  ]);

  await waitForTransitionToComplete();

  const emailInput = (await page.waitForSelector(
    '[type="email"]',
  )) as ElementHandle<HTMLInputElement> | null;
  if (!emailInput) throw Error("emailInput not found");
  await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
  await waitForTransitionToComplete();
  await emailInput.type(TEST_USER_EMAIL, { delay: 10 });
  expect(await emailInput.evaluate((el) => el.value)).toBe(TEST_USER_EMAIL);

  const passwordInput = (await page.$(
    '[type="password"]',
  )) as ElementHandle<HTMLInputElement>;
  await passwordInput.type(TEST_USER_PASSWORD, { delay: 10 });
  expect(await passwordInput.evaluate((el) => el.value)).toBe(
    TEST_USER_PASSWORD,
  );

  await Promise.all([
    page.waitForNavigation({ timeout: 5e3 }),
    passwordInput.press("Enter"),
  ]);

  await page.waitForSelector(SELECTORS.deviceSpecificSettingsDialog);
  const closeButton = (await page.$(
    ".close-button",
  )) as ElementHandle<HTMLButtonElement>;
  await closeButton.evaluate((el) => el.click());
  await page.waitForSelector(SELECTORS.moodList);
};

export const waitForTransitionToComplete = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300));
