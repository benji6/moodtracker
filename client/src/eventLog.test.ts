import { describe, expect, it } from "vitest";
import { eventLogUrl, paginateEventDays, parseEventLogRange } from "./eventLog";
import { createDateFromLocalDateString } from "./utils";

describe("event log ranges", () => {
  it.each([
    ["2024-02-29", "2024-02-29"],
    [null, "2024-03-01"],
    ["2024-03-01", null],
    [null, null],
  ])("accepts %s through %s", (from, to) => {
    const range = parseEventLogRange(from, to);
    expect(range.isValid).toBe(true);
    expect(range.dateFrom).toEqual(
      from ? createDateFromLocalDateString(from) : undefined,
    );
    expect(range.dateTo).toEqual(
      to ? createDateFromLocalDateString(to) : undefined,
    );
  });

  it.each([
    ["2023-02-29", null],
    ["2024-04-31", null],
    ["2024-13-01", null],
    ["2024-2-01", null],
    ["", null],
    ["2024-03-01T00:00:00Z", null],
    [null, "invalid"],
    ["2024-03-02", "2024-03-01"],
  ])("rejects %s through %s", (from, to) => {
    expect(parseEventLogRange(from, to).isValid).toBe(false);
  });

  it.each([
    ["2024-12-31", "2025-01-01", "2024-12-31"],
    ["2024-12-30", "2025-01-06", "2025-01-05"],
    ["2024-02-01", "2024-03-01", "2024-02-29"],
    ["2024-01-01", "2025-01-01", "2024-12-31"],
  ])("links the full period %s to %s", (from, end, to) => {
    expect(
      eventLogUrl(
        createDateFromLocalDateString(from),
        createDateFromLocalDateString(end),
      ),
    ).toBe(`/events?dateFrom=${from}&dateTo=${to}`);
  });
});

describe("event log pagination", () => {
  const events = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    date: new Date(2024, 2, 1 + i * 2, 12),
  }));

  it("paginates seven recorded days newest first, skipping empty dates", () => {
    const first = paginateEventDays(events, null);
    expect(first).toMatchObject({
      page: 1,
      pageCount: 3,
    });
    expect(first.days.map(([, entries]) => entries[0].id)).toEqual([
      15, 14, 13, 12, 11, 10, 9,
    ]);
    expect(
      paginateEventDays(events, "2").days.map(([, entries]) => entries[0].id),
    ).toEqual([8, 7, 6, 5, 4, 3, 2]);
    expect(
      paginateEventDays(events, "3").days.map(([, entries]) => entries[0].id),
    ).toEqual([1, 0]);
    expect(events[0].id).toBe(0);
  });

  it("keeps all events for a local day together, newest first", () => {
    const busyDay = Array.from({ length: 23 }, (_, id) => ({
      id,
      date: new Date(2024, 2, 10, 0, id),
    }));
    const result = paginateEventDays(busyDay, null);
    expect(result.pageCount).toBe(1);
    expect(result.days).toEqual([["2024-03-10", busyDay.toReversed()]]);
    expect(busyDay[0].id).toBe(0);
  });

  it.each(["0", "-1", "2abc", "1.5", "NaN", "9007199254740992"])(
    "normalizes invalid page %s",
    (page) => {
      expect(paginateEventDays(events, page).page).toBe(1);
    },
  );

  it("clamps pages after data is removed and handles empty results", () => {
    expect(paginateEventDays(events.slice(0, 8), "3")).toEqual({
      page: 2,
      pageCount: 2,
      days: [["2024-03-01", [events[0]]]],
    });
    expect(paginateEventDays([], "3")).toEqual({
      page: 1,
      pageCount: 1,
      days: [],
    });
  });
});
