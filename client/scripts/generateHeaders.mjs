import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { BUILD_PATH } from "./constants.mjs";

const html = await readFile(path.join(BUILD_PATH, "index.html"), "utf8");
const scriptHashes = [];
for (const [, attributes, content] of html.matchAll(
  /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi,
)) {
  if (/\bsrc\s*=/i.test(attributes)) continue;
  scriptHashes.push(
    `'sha256-${createHash("sha256").update(content).digest("base64")}'`,
  );
}

const policy = [
  "default-src 'self'",
  // Parcel generates an inline import map whose contents change with each build.
  ["script-src 'self'", ...scriptHashes].join(" "),
  "connect-src 'self' https://cognito-identity.us-east-1.amazonaws.com https://cognito-idp.us-east-1.amazonaws.com https://fcmregistrations.googleapis.com https://firebaseinstallations.googleapis.com https://o4504114345017344.ingest.sentry.io/api/4504114369527808/envelope/ https://places.geo.us-east-1.amazonaws.com/places/v0/indexes/MoodTrackerPlaceIndex/search/position",
  "frame-ancestors 'none'",
  "report-uri https://o4504114345017344.ingest.sentry.io/api/4504114369527808/security/?sentry_key=7fc7812ff3d6482ba2113d6fc90177fa",
].join(";");

await writeFile(
  path.join(BUILD_PATH, "_headers"),
  `/*\n  Content-Security-Policy: ${policy}\n`,
);
