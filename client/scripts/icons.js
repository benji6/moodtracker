const favicons = require("favicons");
const fs = require("fs").promises;
const path = require("path");

const iconsPath = path.join(__dirname, "..", "src", "icons");
const source = path.join(iconsPath, "icon.svg");

const configuration = {
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

favicons(source, configuration, (err, response) => {
  if (err) throw err;

  response.images
    .filter(({ name }) =>
      [
        "android-chrome-192x192.png",
        "android-chrome-512x512.png",
        "apple-touch-icon.png",
        "favicon.ico",
      ].includes(name)
    )
    .map(({ contents, name }) => ({
      contents,
      name: name.replace("android-chrome", "icon"),
    }))
    .forEach(({ contents, name }) =>
      fs.writeFile(path.join(iconsPath, name), contents)
    );
});
