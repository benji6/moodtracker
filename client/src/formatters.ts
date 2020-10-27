import { endOfWeek, startOfWeek } from "date-fns";

export const WEEK_OPTIONS = {
  weekStartsOn: 1,
} as const;

export const dayMonthFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

export const dateFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export const monthFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const weekFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const weekdayFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "long",
});

export const weekdayShortFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in weekFormatter
    ? (weekFormatter as any).formatRange(dateA, dateB)
    : `${weekFormatter.format(dateA)} – ${weekFormatter.format(dateB)}`;

export const formatWeek = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));
