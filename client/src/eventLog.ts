import { isValid, subDays } from "date-fns";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
} from "./utils";

export function parseEventLogDate(value: string | null): Date | undefined {
  if (value === null) return;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
  const date = createDateFromLocalDateString(value);
  if (isValid(date) && formatIsoDateInLocalTimezone(date) === value)
    return date;
}

export function parseEventLogRange(from: string | null, to: string | null) {
  const dateFrom = parseEventLogDate(from);
  const dateTo = parseEventLogDate(to);
  return {
    dateFrom,
    dateTo,
    isValid:
      (from === null || dateFrom !== undefined) &&
      (to === null || dateTo !== undefined) &&
      !(dateFrom && dateTo && dateFrom > dateTo),
  };
}

export function eventLogUrl(dateFrom: Date, exclusiveDateTo: Date) {
  const params = new URLSearchParams({
    dateFrom: formatIsoDateInLocalTimezone(dateFrom),
    dateTo: formatIsoDateInLocalTimezone(subDays(exclusiveDateTo, 1)),
  });
  return `/events?${params}`;
}

export function paginateEventDays<T extends { date: Date }>(
  events: T[],
  requestedPage: string | null,
) {
  const days = new Map<string, T[]>();
  for (const event of events) {
    const day = formatIsoDateInLocalTimezone(event.date);
    const dayEvents = days.get(day);
    if (dayEvents) dayEvents.push(event);
    else days.set(day, [event]);
  }
  const parsedPage =
    requestedPage && /^[1-9]\d*$/.test(requestedPage)
      ? Number(requestedPage)
      : 1;
  const pageCount = Math.max(1, Math.ceil(days.size / 7));
  const page = Number.isSafeInteger(parsedPage)
    ? Math.min(parsedPage, pageCount)
    : 1;
  const end = Math.max(0, days.size - (page - 1) * 7);
  return {
    page,
    pageCount,
    days: [...days]
      .slice(Math.max(0, end - 7), end)
      .reverse()
      .map(([day, dayEvents]): [string, T[]] => [day, dayEvents.toReversed()]),
  };
}
