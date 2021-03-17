const path = require("path");
const fs = require("fs").promises;
const url = require("url");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { FRAGMENT_PATH } = require("./constants");

const ORIGIN = "http://localhost:1234";

const routesToVisit = ["/"];
const knownRoutes = new Set(routesToVisit);

(async () => {
  // menu is only open on wide resolutions
  let browser = await puppeteer.launch({
    defaultViewport: { height: 1050, width: 1680 },
  });
  let page = await browser.newPage();

  while (routesToVisit.length) {
    const route = routesToVisit.pop();
    console.log("Crawling route: ", route);

    await page.goto(`${ORIGIN}${route}`);

    const output = await page.waitForSelector("#output");

    const html = await output.evaluate((node) => node.textContent);
    const $ = cheerio.load(html);
    const links = $("a")
      .map(function () {
        return $(this).attr("href");
      })
      .toArray();

    for (const link of links) {
      if (
        url.parse(link).host ||
        knownRoutes.has(link) ||
        link.startsWith("/settings") ||
        link.startsWith("/stats")
      )
        continue;
      knownRoutes.add(link);
      routesToVisit.push(link);
    }
  }

  await browser.close();

  // nicer experience if starting with narrow resolution markup
  browser = await puppeteer.launch({
    defaultViewport: { height: 812, width: 375 },
  });
  page = await browser.newPage();

  for (const route of knownRoutes.values()) {
    console.log("Scraping route: ", route);
    await page.goto(`${ORIGIN}${route}`);

    const output = await page.waitForSelector("#output");
    const htmlFragment = await output.evaluate((node) => node.textContent);

    fs.writeFile(
      path.join(FRAGMENT_PATH, `${route === "/" ? "index" : route}.html`),
      htmlFragment
    );
  }

  await browser.close();

  console.log("Finished successfully! 🍄");
})();
