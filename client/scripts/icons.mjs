import { SOURCE_PATH } from "./constants.mjs";
import { favicons } from "favicons";
import { promises as fs } from "fs";
import path from "path";

const iconsDirPath = path.join(SOURCE_PATH, "icons");
const iconPath = path.join(iconsDirPath, "icon-without-css.svg");

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
  const response = await favicons(iconPath, faviconsConfig);

  response.images
    .filter(({ name }) =>
      [
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "apple-touch-icon.png",
      ].includes(name),
    )
    .map(({ contents, name }) => ({
      contents,
      name: name.replace("android-chrome", "icon"),
    }))
    .forEach(({ contents, name }) =>
      fs.writeFile(path.join(iconsDirPath, name), contents),
    );
})();
