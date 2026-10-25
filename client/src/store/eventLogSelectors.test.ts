import { describe, expect, it } from "vitest";
import eventsSlice from "./eventsSlice";
import { AppEvent } from "../types";
import { createDateFromLocalDateString } from "../utils";

function makeState(events: AppEvent[]) {
  return {
    events: events.reduce(
      (state, event) =>
        eventsSlice.reducer(state, eventsSlice.actions.add(event)),
      eventsSlice.getInitialState(),
    ),
  };
}

const day = createDateFromLocalDateString("2024-03-10");
const createdAt = (hour: number) => new Date(2024, 2, 10, hour).toISOString();

describe("combined event selectors", () => {
  it("includes every category, excludes deletions, and uses updated dates", () => {
    const state = makeState([
      {
        createdAt: createdAt(0),
        type: "v1/leg-raises/create",
        payload: { value: 10 },
      },
      {
        createdAt: createdAt(1),
        type: "v1/meditations/create",
        payload: { seconds: 60 },
      },
      {
        createdAt: createdAt(3),
        type: "v1/moods/create",
        payload: { mood: 5 },
      },
      {
        createdAt: createdAt(4),
        type: "v1/push-ups/create",
        payload: { value: 10 },
      },
      {
        createdAt: createdAt(5),
        type: "v1/runs/create",
        payload: { meters: 1000 },
      },
      {
        createdAt: createdAt(6),
        type: "v1/sit-ups/create",
        payload: { value: 10 },
      },
      {
        createdAt: createdAt(7),
        type: "v1/sleeps/create",
        payload: { dateAwoke: "2024-03-09", minutesSlept: 480 },
      },
      {
        createdAt: createdAt(8),
        type: "v1/weights/create",
        payload: { value: 70 },
      },
      {
        createdAt: createdAt(9),
        type: "v1/weights/create",
        payload: { value: 71 },
      },
      {
        createdAt: createdAt(10),
        type: "v1/weights/delete",
        payload: createdAt(9),
      },
      {
        createdAt: createdAt(11),
        type: "v1/moods/update",
        payload: { id: createdAt(3), mood: 8, experiencedAt: createdAt(0) },
      },
      {
        createdAt: createdAt(12),
        type: "v1/sleeps/update",
        payload: {
          id: createdAt(7),
          dateAwoke: "2024-03-10",
          minutesSlept: 500,
        },
      },
    ]);
    const events = eventsSlice.selectors.trackedEventsInPeriod(state, day, day);
    expect(events.map(({ type }) => type)).toEqual([
      "sleeps",
      "leg-raises",
      "moods",
      "meditations",
      "push-ups",
      "runs",
      "sit-ups",
      "weights",
    ]);
    expect(events.find(({ type }) => type === "sleeps")?.date).toEqual(day);
    expect(
      eventsSlice.selectors.normalizedMoods(state).byId[createdAt(3)].mood,
    ).toBe(8);
    expect(eventsSlice.selectors.trackedEventsInPeriod(state)).toHaveLength(8);
  });

  it("includes a whole local day but not the following midnight", () => {
    const nextMidnight = new Date(2024, 2, 11).toISOString();
    const beforeMidnight = new Date(2024, 2, 9, 23, 59, 59, 999).toISOString();
    const lastMoment = new Date(2024, 2, 10, 23, 59, 59, 999).toISOString();
    const state = makeState([
      {
        createdAt: beforeMidnight,
        type: "v1/weights/create",
        payload: { value: 70 },
      },
      {
        createdAt: createdAt(0),
        type: "v1/weights/create",
        payload: { value: 71 },
      },
      {
        createdAt: lastMoment,
        type: "v1/weights/create",
        payload: { value: 72 },
      },
      {
        createdAt: nextMidnight,
        type: "v1/weights/create",
        payload: { value: 73 },
      },
    ]);
    expect(
      eventsSlice.selectors
        .trackedEventsInPeriod(state, day, day)
        .map(({ id }) => id),
    ).toEqual([createdAt(0), lastMoment]);
    expect(
      eventsSlice.selectors.trackedEventsInPeriod(state, undefined, day),
    ).toHaveLength(3);
    expect(
      eventsSlice.selectors.trackedEventsInPeriod(state, day),
    ).toHaveLength(3);
  });

  it("filters backdated moods and sleeps by their dates, not creation time", () => {
    const state = makeState([
      {
        createdAt: createdAt(3),
        type: "v1/moods/create",
        payload: {
          mood: 5,
          experiencedAt: new Date(2024, 2, 9, 12).toISOString(),
        },
      },
      {
        createdAt: createdAt(4),
        type: "v1/sleeps/create",
        payload: { dateAwoke: "2024-03-09", minutesSlept: 480 },
      },
    ]);
    expect(
      eventsSlice.selectors.trackedEventsInPeriod(state, day, day),
    ).toEqual([]);
    expect(eventsSlice.selectors.trackedEventsInPeriod(state)).toHaveLength(2);
    expect(
      eventsSlice.selectors.trackedEventsInPeriod(makeState([]), day, day),
    ).toEqual([]);
  });
});
