const path = require("path");

module.exports.BUILD_PATH = path.join(__dirname, "..", "dist");

module.exports.SOURCE_PATH = path.join(__dirname, "..", "src");

module.exports.FRAGMENT_PATH = path.join(
  module.exports.SOURCE_PATH,
  "prerendered-fragments"
);
