import addDays from "date-fns/addDays";
import startOfWeek from "date-fns/startOfWeek";
import {
  WEEK_OPTIONS,
  weekdayNarrowFormatter,
  weekdayShortFormatter,
} from "./formatters/dateTimeFormatters";

export const BUILD_TIME = process.env.BUILD_TIME!;
export const DESCRIPTION_MAX_LENGTH = 32;
export const MEDITATION_SEARCH_PARAM_TIME_KEY = "t";
export const MINIMUM_WORD_CLOUD_WORDS = 5;
export const MOOD_RANGE: [number, number] = [0, 10];
export const MOOD_EXTENT = (MOOD_RANGE[1] - MOOD_RANGE[0]) as 10;
export const MOOD_INTEGERS = [...Array(MOOD_EXTENT + 1).keys()] as const;

export const GH_USER_URL = "https://github.com/benji6";
export const REPO_URL = `${GH_USER_URL}/moodtracker`;
export const REPO_ISSUES_URL = `${REPO_URL}/issues`;

export const MOODTRACKER_DESCRIPTION =
  "MoodTracker is a free and open source web app that aims to help you understand yourself better. Track your emotional landscape, keep a mood journal, time your meditations, keep a meditation log and gain new insights into yourself. It's simple to use, works offline and because it runs in your browser you can use it across all your devices!";

export const AWS_CONSTANTS = {
  cognitoIdentityPoolId: "us-east-1:4338729d-7f9a-4d17-b26a-ec5e2b0ee928",
  cognitoUserPoolId: "us-east-1_rdB8iu5X4",
  region: "us-east-1",
};

export const ERRORS = {
  generic:
    "Something went wrong, check the data you have entered and try again",
  integer: "Please type a valid whole number",
  network:
    "Something went wrong. This feature requires an internet connection, please check your connection and try again. If the problem persists it may be an issue on our side.",
  noChanges: "No changes have been made, please make an update then try again",
  server: (
    <>
      Something went wrong. This looks like a problem on our side. We will look
      into it. Please try again later. If the problem persists then{" "}
      <a href={REPO_ISSUES_URL} rel="noopener" target="_blank">
        raise an issue on GitHub
      </a>
    </>
  ),
  specialCharacters: "This field must not contain any special characters",
  rangeOverflow: "Value is too big, please input something smaller",
  rangeUnderflow: "Value is too small, please input something bigger",
  required: "Required",
} as const;

export const PATTERNS = {
  noPunctuation:
    "[^‒–—―|$&~=\\/⁄@+*!?({[\\]})<>‹›«».;:^‘’“”'\",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]*",
} as const;

export const TIME = {
  daysPerWeek: 7,
  hoursPerDay: 24,
  millisecondsPerDay: 86400000,
  secondsPerDay: 86400,
  secondsPerHour: 3600,
  secondsPerMinute: 60,
  secondsPerYear: 31536000,
} as const;

export const TEST_IDS = (() => {
  const keys = [
    "addMoodPage",
    "addMoodRadioButton",
    "addMoodSubmitButton",
    "descriptionInput",
    "deviceSpecificSettingsDialog",
    "meditatePage",
    "meditationCustomTimeInput",
    "meditationPresetTimeButton",
    "meditationTimerPage",
    "moodCardMood",
    "moodCardTime",
    "moodList",
    "navButton",
    "resetPasswordPage",
    "signInLink",
    "signOutButton",
    "signOutConfirmButton",
    "statsOverviewPage",
    "weightAddPage",
    "weightAddSubmitButton",
    "weightCardTime",
    "weightCardValue",
    "weightValueInput",
  ] as const;
  const testIds = {} as {
    [k in (typeof keys)[number]]: (typeof keys)[number];
  };
  for (const key of keys) testIds[key] = key;
  return testIds;
})();

export const FIELDS = {
  description: {
    autoComplete: "on",
    "data-test-id": TEST_IDS.descriptionInput,
    label: "Mood tags",
    maxLength: DESCRIPTION_MAX_LENGTH,
    name: "description",
    optional: true,
    pattern: PATTERNS.noPunctuation,
    supportiveText: `Add one or more words separated by spaces to describe your mood (${DESCRIPTION_MAX_LENGTH} characters max). For example, "pensive" or "happy excited". These words will be used in your word clouds.`,
  },
  exploration: {
    label: "Mood journal",
    name: "exploration",
    optional: true,
    rows: 5,
    supportiveText:
      "Use this space as a journal to explore how you're feeling, why you're feeling that way and what's going on in your life right now",
  },
  mood: {
    label: "Mood",
    name: "mood",
  },
  weight: {
    "data-test-id": TEST_IDS.weightValueInput,
    label: "Weight (kg)",
    max: 650,
    min: 0,
    name: "weight",
    style: { width: "6em" },
    step: 0.1,
    supportiveText: "The best time to weigh yourself is after you wake up",
    type: "number",
  },
} as const;

export const HIGHLY_CACHED_QUERY_OPTIONS = {
  cacheTime: Infinity,
  networkMode: "offlineFirst",
  staleTime: TIME.secondsPerYear * 1e3,
} as const;

const now = Date.now();
const startOfWeekDate = startOfWeek(now, WEEK_OPTIONS);

const weekdayDates = [
  addDays(startOfWeekDate, 0),
  addDays(startOfWeekDate, 1),
  addDays(startOfWeekDate, 2),
  addDays(startOfWeekDate, 3),
  addDays(startOfWeekDate, 4),
  addDays(startOfWeekDate, 5),
  addDays(startOfWeekDate, 6),
] as const;

type WeekdayLabels = [string, string, string, string, string, string, string];
export const WEEKDAY_LABELS_NARROW: WeekdayLabels = weekdayDates.map((date) =>
  weekdayNarrowFormatter.format(date)
) as WeekdayLabels;

export const WEEKDAY_LABELS_SHORT: WeekdayLabels = weekdayDates.map((date) =>
  weekdayShortFormatter.format(date)
) as WeekdayLabels;
