import {
  WEEK_OPTIONS,
  weekdayNarrowFormatter,
  weekdayShortFormatter,
} from "../formatters/dateTimeFormatters";
import { addDays, startOfWeek } from "date-fns";
import testIds from "./testIds";
import { Link } from "react-router";

if (!process.env.BUILD_TIME) throw Error("BUILD_TIME is undefined");
export const BUILD_TIME = process.env.BUILD_TIME;
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDJUEfQvbke4ImRxqW5KwijugRKCzXw4BY",
  appId: "1:189351604256:web:35457f768494fdf7e14c45",
  messagingSenderId: "189351604256",
  projectId: "moodtracker-4df02",
} as const;
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
      <a href={REPO_ISSUES_URL} rel="noopener noreferrer" target="_blank">
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
  noPunctuation: "[\\p{L}\\p{Emoji_Presentation}\\s\\-]*",
} as const;

// All these keys are purged by default when a user signs out.
// If there is value in not purging specific keys then make an
// allowance for that in the signout logic
export const QUERY_KEYS = {
  reverseGeolocation: "reverse-geolocation",
  usage: "usage",
  weather: "weather",
  webPushTokens: "web-push-tokens",
  weeklyEmails: "weekly-emails",
} as const;

export const TIME = {
  daysPerWeek: 7,
  hoursPerDay: 24,
  millisecondsPerDay: 86400000,
  minutesPerHour: 60,
  secondsPerDay: 86400,
  secondsPerHour: 3600,
  secondsPerMinute: 60,
  secondsPerYear: 31536000,
} as const;

export const TEST_IDS = testIds;

const DESCRIPTION_MAX_LENGTH = 32;
export const FIELDS = {
  dateAwoke: {
    "data-test-id": TEST_IDS.dateAwokeInput,
    label: "Date you woke up",
    name: "date-awoke",
    type: "date",
  },
  description: {
    autoComplete: "on",
    label: "Mood tags",
    maxLength: DESCRIPTION_MAX_LENGTH,
    name: "description",
    optional: true,
    pattern: PATTERNS.noPunctuation,
    supportiveText: `Add one or more words separated by spaces to describe your mood (${DESCRIPTION_MAX_LENGTH} characters max). For example, "pensive" or "happy excited". These words will be used in your word clouds.`,
  },
  exploration: {
    "data-test-id": TEST_IDS.explorationInput,
    label: "Journal",
    name: "exploration",
    optional: true,
    rows: 5,
    supportiveText: (
      <>
        Use this space however you like! You could drop a couple words that
        describe how you&apos;re feeling, or you could write a full journal
        entry. Once you&apos;ve logged enough words, you&apos;ll be able to see
        word clouds in your <Link to="/stats">stats pages</Link>.
      </>
    ),
  },
  runMeters: {
    "data-test-id": TEST_IDS.runMetersInput,
    label: "Meters",
    // A marathon is 42.195 km
    max: 5e4,
    min: 1,
    name: "meters",
    optional: true,
    style: { width: "5em" },
    type: "number",
  },
  runMinutes: {
    "data-test-id": TEST_IDS.runMinutesInput,
    label: "Minutes",
    name: "minutes",
    optional: true,
  },
  runSeconds: {
    "data-test-id": TEST_IDS.runSecondsInput,
    label: "Seconds",
    name: "seconds",
    optional: true,
  },
  hoursSlept: {
    "data-test-id": TEST_IDS.hoursSleptInput,
    label: "Hours slept",
    name: "hours-slept",
  },
  legRaises: {
    "data-test-id": TEST_IDS.legRaisesValueInput,
    label: "Leg raises",
    max: 1000,
    min: 1,
    name: "leg-raises",
    style: { width: "5em" },
    supportiveText: "You can log your sets individually or all together",
    type: "number",
  },
  minutesSlept: {
    "data-test-id": TEST_IDS.minutesSleptInput,
    label: "Minutes slept",
    name: "minutes-slept",
  },
  mood: {
    label: "Mood",
    name: "mood",
  },
  pushUps: {
    "data-test-id": TEST_IDS.pushUpsValueInput,
    label: "Push-ups",
    max: 1000,
    min: 1,
    name: "push-ups",
    style: { width: "5em" },
    supportiveText: "You can log your sets individually or all together",
    type: "number",
  },
  sitUps: {
    "data-test-id": TEST_IDS.sitUpsValueInput,
    label: "Sit-ups",
    max: 1000,
    min: 1,
    name: "sit-ups",
    style: { width: "5em" },
    supportiveText: "You can log your sets individually or all together",
    type: "number",
  },
  weight: {
    "data-test-id": TEST_IDS.weightValueInput,
    label: "Weight (kg)",
    max: 650,
    min: 1,
    name: "weight",
    style: { width: "5em" },
    step: 0.1,
    supportiveText: "The best time to weigh yourself is after you wake up",
    type: "number",
  },
} as const;

export const HIGHLY_CACHED_QUERY_OPTIONS = {
  networkMode: "offlineFirst",
  staleTime: Infinity,
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
  weekdayNarrowFormatter.format(date),
) as WeekdayLabels;

export const WEEKDAY_LABELS_SHORT: WeekdayLabels = weekdayDates.map((date) =>
  weekdayShortFormatter.format(date),
) as WeekdayLabels;
