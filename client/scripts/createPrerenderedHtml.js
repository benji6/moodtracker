const path = require("path");
const fs = require("fs").promises;

const buildPath = path.join(__dirname, "..", "dist");
const fragmentPath = path.join(__dirname, "..", "src", "prerendered-fragments");
const ROOT_DIV = '<div id="root"></div>';

(async () => {
  const template = await fs.readFile(
    path.join(buildPath, "index.html"),
    "utf-8"
  );

  if (!template.includes(ROOT_DIV)) throw Error("Could not find root div");

  const fragmentFilenames = await fs.readdir(fragmentPath);

  for (const fragmentFilename of fragmentFilenames) {
    const fragment = await fs.readFile(
      path.join(fragmentPath, fragmentFilename),
      "utf-8"
    );

    fs.writeFile(
      path.join(buildPath, fragmentFilename),
      template.replace(ROOT_DIV, `<div id="root">${fragment}</div>`)
    );
  }
})();
