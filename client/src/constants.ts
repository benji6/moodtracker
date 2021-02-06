import addDays from "date-fns/addDays";
import startOfWeek from "date-fns/startOfWeek";
import {
  weekdayNarrowFormatter,
  weekdayShortFormatter,
  WEEK_OPTIONS,
} from "./formatters";

export const DAYS_PER_WEEK = 7;
export const DESCRIPTION_MAX_LENGTH = 32;
export const HOURS_PER_DAY = 24;
export const MOOD_RANGE: [number, number] = [0, 10];
export const MOOD_INTEGERS = [
  ...Array(MOOD_RANGE[1] - MOOD_RANGE[0] + 1).keys(),
] as const;
export const NETWORK_ERROR_MESSAGE =
  "Something went wrong, check your internet connection and try again";

// extracted from the cognito console and update manually for now
// if it ever starts increasing quickly then we can automate this
export const TOTAL_USERS = 35;

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
