const path = require("path");
const fs = require("fs").promises;

const ignoreSet = new Set(["index.html", "robots.txt", "service-worker.js"]);
const buildPath = path.join(__dirname, "..", "dist");

(async () => {
  const files = await fs.readdir(buildPath);
  const filteredFiles = files.filter((file) => !ignoreSet.has(file));
  const cacheList = ["/", ...filteredFiles];
  const serviceWorkerPath = path.join(buildPath, "service-worker.js");
  const serviceWorker = await fs.readFile(serviceWorkerPath, "utf-8");
  return fs.writeFile(
    serviceWorkerPath,
    serviceWorker.replace("CACHE_LIST", cacheList)
  );
})();
