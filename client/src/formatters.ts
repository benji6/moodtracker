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
  year: "numeric",
});

export const dateWeekdayFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export const monthFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

export const timeFormatter = Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

export const weekdayFormatterNarrow = Intl.DateTimeFormat(undefined, {
  weekday: "narrow",
});

export const weekdayFormatterShort = Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in dateFormatter
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dateFormatter as any).formatRange(dateA, dateB)
    : `${dateFormatter.format(dateA)} – ${dateFormatter.format(dateB)}`;

export const formatWeek = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));
