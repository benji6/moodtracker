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
  const cacheList = ["/", ...filteredFiles];
  const serviceWorkerPath = path.join(BUILD_PATH, "service-worker.js");
  const serviceWorker = await fs.readFile(serviceWorkerPath, "utf-8");
  return fs.writeFile(
    serviceWorkerPath,
    serviceWorker.replace("CACHE_LIST", cacheList),
  );
})();
