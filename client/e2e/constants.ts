import { TEST_IDS } from "../src/constants";

export const ROOT_DOCUMENT_TITLE =
  "MoodTracker - A mood tracker & meditation timer that helps you understand yourself";

export const SELECTORS = {} as { [k in keyof typeof TEST_IDS]: string };
for (const [k, v] of Object.entries(TEST_IDS))
  SELECTORS[k as keyof typeof TEST_IDS] = `[data-test-id="${v}"]`;

export class URLS {
  static readonly origin = "http://localhost:1234";

  static readonly add = `${URLS.origin}/add`;
  static readonly home = `${URLS.origin}/`;
  static readonly meditation = `${URLS.origin}/meditation`;
  static readonly meditationTimer = `${URLS.meditation}/timer`;
  static readonly pushUpsAdd = `${URLS.origin}/push-ups/add`;
  static readonly pushUpsLog = `${URLS.origin}/push-ups/log`;
  static readonly resetPassowrd = `${URLS.origin}/reset-password`;
  static readonly sleepAdd = `${URLS.origin}/sleep/add`;
  static readonly sleepLog = `${URLS.origin}/sleep/log`;
  static readonly statsOverview = `${URLS.origin}/stats`;
  static readonly weightAdd = `${URLS.origin}/weight/add`;
  static readonly weightLog = `${URLS.origin}/weight/log`;
}
