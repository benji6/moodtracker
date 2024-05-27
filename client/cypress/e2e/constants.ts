import TEST_IDS from "../../src/constants/testIds";

// Note that this is a subset of ERRORS constant from `src` directory. That module is .tsx so cannot be imported by Cypress
export const ERRORS = {
  integer: "Please type a valid whole number",
  rangeOverflow: "Value is too big, please input something smaller",
  rangeUnderflow: "Value is too small, please input something bigger",
  required: "Required",
  specialCharacters: "This field must not contain any special characters",
};

export const PATHS = {
  meditation: "/meditation",
  meditationTimer: "/meditation/timer",
  moodAdd: "/add",
  pushUpsAdd: "/push-ups/add",
  pushUpsLog: "/push-ups/log",
  resetPassword: "/reset-password",
  sleepAdd: "/sleep/add",
  sleepLog: "/sleep/log",
  statsOverview: "/stats",
  weightAdd: "/weight/add",
  weightLog: "/weight/log",
} as const;

export const ROOT_DOCUMENT_TITLE =
  "MoodTracker - A mood tracker & meditation timer that helps you understand yourself";

export const SELECTORS = {} as { [k in keyof typeof TEST_IDS]: string };
for (const [k, v] of Object.entries(TEST_IDS))
  SELECTORS[k as keyof typeof TEST_IDS] = `[data-test-id="${v}"]`;
