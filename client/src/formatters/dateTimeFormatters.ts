import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";

export const WEEK_OPTIONS = { weekStartsOn: 1 } as const;

export const dayMonthFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "short",
});

export const dateFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const dateTimeFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  month: "numeric",
  second: "numeric",
  year: "numeric",
});

export const dateWeekdayFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  weekday: "long",
  year: "numeric",
});

export const hourNumericFormatter = Intl.DateTimeFormat(undefined, {
  hour: "numeric",
});

export const monthLongFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
});
export const monthNarrowFormatter = Intl.DateTimeFormat(undefined, {
  month: "narrow",
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

export const weekdayNarrowFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "narrow",
});
export const weekdayShortFormatter = Intl.DateTimeFormat(undefined, {
  weekday: "short",
});

export const yearFormatter = Intl.DateTimeFormat(undefined, {
  year: "numeric",
});

const dayMonthLongFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
});
const formatRangeDateMonth = (dateA: Date, dateB: Date) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dayMonthLongFormatter as any).formatRange(dateA, dateB); // TODO - remove any once types are up-to-date
export const formatWeek = (week: Date): string =>
  formatRangeDateMonth(
    startOfWeek(week, WEEK_OPTIONS),
    endOfWeek(week, WEEK_OPTIONS)
  );

const formatRange = (dateA: Date, dateB: Date) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (dateFormatter as any).formatRange(dateA, dateB); // TODO - remove any once types are up-to-date
export const formatWeekWithYear = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));
