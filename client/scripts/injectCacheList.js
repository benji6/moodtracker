const path = require("path");
const fs = require("fs").promises;
const { BUILD_PATH } = require("./constants");

const ignoreSet = new Set(["index.html", "robots.txt", "service-worker.js"]);

(async () => {
  const files = await fs.readdir(BUILD_PATH);
  const filteredFiles = files.filter((file) => !ignoreSet.has(file));
  const cacheList = ["/", ...filteredFiles];
  const serviceWorkerPath = path.join(BUILD_PATH, "service-worker.js");
  const serviceWorker = await fs.readFile(serviceWorkerPath, "utf-8");
  return fs.writeFile(
    serviceWorkerPath,
    serviceWorker.replace("CACHE_LIST", cacheList)
  );
})();
