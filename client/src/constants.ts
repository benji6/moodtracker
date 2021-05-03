import addDays from "date-fns/addDays";
import startOfWeek from "date-fns/startOfWeek";
import {
  weekdayNarrowFormatter,
  weekdayShortFormatter,
  WEEK_OPTIONS,
} from "./formatters";

export const DESCRIPTION_MAX_LENGTH = 32;
export const MEDITATION_SEARCH_PARAM_TIME_KEY = "t";
export const MOOD_RANGE: [number, number] = [0, 10];
export const MOOD_INTEGERS = [
  ...Array(MOOD_RANGE[1] - MOOD_RANGE[0] + 1).keys(),
] as const;

// extracted from cognito and updated manually for now
// if needed we can look at automating this in the future
export const TOTAL_USERS = 50;

export const ERRORS = {
  integer: "Please type a valid whole number",
  network: "Something went wrong, check your internet connection and try again",
  specialCharacters: "This field must not contain any special characters",
  required: "Required",
} as const;

export const PATTERNS = {
  noPunctuation:
    "[^‒–—―|$&~=\\/⁄@+*!?({[\\]})<>‹›«».;:^‘’“”'\",،、`·•†‡°″¡¿※#№÷×%‰−‱¶′‴§_‖¦]*",
} as const;

export const FIELDS = {
  description: {
    autoComplete: "on",
    label: "Mood tags",
    maxLength: DESCRIPTION_MAX_LENGTH,
    name: "description",
    optional: true,
    pattern: PATTERNS.noPunctuation,
    supportiveText: `Add one or more words separated by spaces to describe your mood (${DESCRIPTION_MAX_LENGTH} characters max). These words will be used in your word clouds and as search terms.`,
  },
  exploration: {
    label: "Exploration",
    name: "exploration",
    optional: true,
    rows: 5,
    supportiveText:
      "Use this space to explore how you're feeling, why you're feeling that way and what's going on in your life right now",
  },
  mood: {
    label: "Mood",
    name: "mood",
  },
} as const;

export const TIME = {
  daysPerWeek: 7,
  hoursPerDay: 24,
  secondsPerMinute: 60,
} as const;

export const TEST_IDS = (() => {
  const keys = [
    "addMoodPage",
    "addMoodRadioButton",
    "addMoodSubmitButton",
    "descriptionInput",
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
  ] as const;
  const testIds = {} as {
    [k in typeof keys[number]]: typeof keys[number];
  };
  for (const key of keys) testIds[key] = key;
  return testIds;
})();

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
