import * as Sentry from "@sentry/browser";

if (process.env.NODE_ENV === "production")
  Sentry.init({
    dsn: "https://7fc7812ff3d6482ba2113d6fc90177fa@o4504114345017344.ingest.sentry.io/4504114369527808",
    // COMMIT_REF automatically supplied by Netlify https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
    release: process.env.COMMIT_REF,
  });

export const captureException: typeof Sentry.captureException = (
  exception,
  context
) =>
  process.env.NODE_ENV === "production"
    ? Sentry.captureException(exception, context)
    : "";
