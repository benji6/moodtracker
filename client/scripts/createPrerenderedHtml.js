const path = require("path");
const fs = require("fs").promises;
const { BUILD_PATH, FRAGMENT_PATH } = require("./constants");

const ROOT_DIV = '<div id="root"></div>';

(async () => {
  const template = await fs.readFile(
    path.join(BUILD_PATH, "index.html"),
    "utf-8"
  );

  if (!template.includes(ROOT_DIV)) throw Error("Could not find root div");

  const fragmentFilenames = await fs.readdir(FRAGMENT_PATH);

  for (const fragmentFilename of fragmentFilenames) {
    const fragment = await fs.readFile(
      path.join(FRAGMENT_PATH, fragmentFilename),
      "utf-8"
    );

    fs.writeFile(
      path.join(BUILD_PATH, fragmentFilename),
      template.replace(ROOT_DIV, `<div id="root">${fragment}</div>`)
    );
  }
})();
