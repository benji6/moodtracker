import puppeteer from "puppeteer";
import { ROOT_DOCUMENT_TITLE, URLS } from "./constants";

export const createAndSetUpBrowser = (): Promise<puppeteer.Browser> =>
  puppeteer.launch({
    defaultViewport: { height: 640, width: 360 },
  });

export const createAndSetUpPage = async (
  browser: puppeteer.Browser
): Promise<puppeteer.Page> => {
  const page = await browser.newPage();
  page.setDefaultTimeout(3e3);
  page.setDefaultNavigationTimeout(1e3);
  await page.goto(URLS.origin);
  expect(await page.title()).toBe(ROOT_DOCUMENT_TITLE);
  return page;
};
