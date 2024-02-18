const path = require("path");
const fs = require("fs").promises;
const { BUILD_PATH } = require("./constants");

const ignoreSet = new Set(["index.html", "robots.txt", "service-worker.js"]);

const compileCacheList = async (pathToRead = "", cacheList = []) => {
  const dirents = await fs.readdir(path.join(BUILD_PATH, pathToRead), {
    withFileTypes: true,
  });
  await Promise.all(
    dirents.map(async (dirent) => {
      if (dirent.isFile()) cacheList.push(path.join(pathToRead, dirent.name));
      else
        return compileCacheList(path.join(pathToRead, dirent.name), cacheList);
    }),
  );
  return cacheList;
};

(async () => {
  const files = await compileCacheList();
  const filteredFiles = files.filter(
    (file) => !(ignoreSet.has(file) || file.endsWith(".map")),
  );
  const networkFirstCache = ["/"];
  const cacheFirstCache = [];
  for (const file of filteredFiles) {
    if (/^.+\..{8}\..{2,5}$/.test(file)) cacheFirstCache.push(file);
    else networkFirstCache.push(file);
  }

  // These checks are intentionally paranoid
  if (
    cacheFirstCache.some((resource) =>
      ["icon-without-css", "robots", "service-worker", "webmanifest"].some(
        (word) => resource.includes(word),
      ),
    ) ||
    cacheFirstCache.includes("/") ||
    cacheFirstCache.some((resource) => networkFirstCache.includes(resource))
  )
    throw Error("Check cache lists");

  const serviceWorkerPath = path.join(BUILD_PATH, "service-worker.js");
  const serviceWorker = await fs.readFile(serviceWorkerPath, "utf-8");
  return fs.writeFile(
    serviceWorkerPath,
    serviceWorker
      .replace("CACHE_FIRST_CACHE", cacheFirstCache)
      .replace("NETWORK_FIRST_CACHE", networkFirstCache),
  );
})();
