import * as Sentry from "@sentry/browser";
import { useSelector } from "react-redux";
import userSlice from "./store/userSlice";

if (process.env.NODE_ENV === "production")
  Sentry.init({
    dsn: "https://7fc7812ff3d6482ba2113d6fc90177fa@o4504114345017344.ingest.sentry.io/4504114369527808",
    // COMMIT_REF automatically supplied by Netlify https://docs.netlify.com/configure-builds/environment-variables/#git-metadata
    release: process.env.COMMIT_REF,
  });

export const captureException: typeof Sentry.captureException = (
  exception,
  context,
) => {
  if (process.env.NODE_ENV === "test") return "";
  if (process.env.NODE_ENV === "production")
    return Sentry.captureException(exception, context);
  // eslint-disable-next-line no-console
  console.error(
    "Following exception would be sent to Sentry in production:",
    exception,
  );
  return "";
};

export const useSentryUser = () => {
  const userId = useSelector(userSlice.selectors.id);
  if (process.env.NODE_ENV !== "production") return;
  Sentry.setUser(userId ? { id: userId } : null);
};
