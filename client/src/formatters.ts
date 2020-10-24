import { endOfWeek, startOfWeek } from "date-fns";

export const WEEK_OPTIONS = {
  weekStartsOn: 1,
} as const;

export const dayMonthFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
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

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in weekFormatter
    ? (weekFormatter as any).formatRange(dateA, dateB)
    : `${weekFormatter.format(dateA)} – ${weekFormatter.format(dateB)}`;

export const formatWeek = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));
