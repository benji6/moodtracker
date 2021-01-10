import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";

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
});

export const monthYearFormatter = Intl.DateTimeFormat(undefined, {
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

export const yearFormatter = Intl.DateTimeFormat(undefined, {
  year: "numeric",
});

const dayMonthLongFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
});
// TODO: One day we should be able to remove this
const formatRangeDateMonth = (dateA: Date, dateB: Date) =>
  "formatRange" in dayMonthLongFormatter
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dayMonthLongFormatter as any).formatRange(dateA, dateB)
    : `${dayMonthLongFormatter.format(dateA)} – ${dayMonthLongFormatter.format(
        dateB
      )}`;
export const formatWeek = (week: Date): string =>
  formatRangeDateMonth(
    startOfWeek(week, WEEK_OPTIONS),
    endOfWeek(week, WEEK_OPTIONS)
  );

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in dateFormatter
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dateFormatter as any).formatRange(dateA, dateB)
    : `${dateFormatter.format(dateA)} – ${dateFormatter.format(dateB)}`;
export const formatWeekWithYear = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));
