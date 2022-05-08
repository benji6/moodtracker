const { favicons } = require("favicons");
const fs = require("fs").promises;
const path = require("path");
const { SOURCE_PATH } = require("./constants");

const iconsDirPath = path.join(SOURCE_PATH, "icons");
const iconPath = path.join(iconsDirPath, "icon.svg");
const processedSvgPath = path.join(iconsDirPath, "icon-processed.svg");

const faviconsConfig = {
  online: false,
  preferOnline: false,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,
    yandex: false,
  },
};

(async () => {
  const svg = await fs.readFile(iconPath, "utf-8");

  // `favicons` does not currently handle this filter
  const processedSvg = svg.replace('filter="url(#shadow)"', "");

  await fs.writeFile(processedSvgPath, processedSvg);

  favicons(processedSvgPath, faviconsConfig, async (err, response) => {
    await fs.unlink(processedSvgPath);
    if (err) throw err;

    response.images
      .filter(({ name }) =>
        [
          "android-chrome-192x192.png",
          "android-chrome-512x512.png",
          "apple-touch-icon.png",
        ].includes(name)
      )
      .map(({ contents, name }) => ({
        contents,
        name: name.replace("android-chrome", "icon"),
      }))
      .forEach(({ contents, name }) =>
        fs.writeFile(path.join(iconsDirPath, name), contents)
      );
  });
})();
