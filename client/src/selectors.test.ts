import {
  normalizedAveragesByMonthSelector,
  normalizedAveragesByWeekSelector,
  normalizedAveragesByYearSelector,
  normalizedMoodsSelector,
  normalizedAveragesByDaySelector,
  denormalizedMoodsSelector,
  normalizedDescriptionWordsSelector,
  normalizedAveragesByHourSelector,
  moodIdsByDateSelector,
  normalizedMeditationsSelector,
  denormalizedMeditationsSelector,
  hasMeditationsSelector,
  meditationStatsSelector,
} from "./selectors";
import store, { RootState } from "./store";

describe("selectors", () => {
  let initialState: RootState;

  beforeAll(() => {
    initialState = store.getState();
  });

  describe("normalizedMeditationsSelector", () => {
    test("when there are no events", () => {
      expect(normalizedMeditationsSelector(initialState)).toEqual({
        allIds: [],
        byId: {},
      });
    });

    test("with a single create event", () => {
      expect(
        normalizedMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:00:00.000Z"],
        byId: { "2020-10-10T08:00:00.000Z": { seconds: 60 } },
      });
    });

    test("with two meditation create events and a mood create event", () => {
      expect(
        normalizedMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-11T08:00:00.000Z",
              "2020-10-12T08:00:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-11T08:00:00.000Z": {
                createdAt: "2020-10-11T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-12T08:00:00.000Z": {
                createdAt: "2020-10-12T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 120 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:00:00.000Z", "2020-10-12T08:00:00.000Z"],
        byId: {
          "2020-10-10T08:00:00.000Z": { seconds: 60 },
          "2020-10-12T08:00:00.000Z": { seconds: 120 },
        },
      });
    });

    test("with a delete event", () => {
      expect(
        normalizedMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 120 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/meditations/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z"],
        byId: { "2020-10-10T08:01:00.000Z": { seconds: 120 } },
      });
    });
  });

  describe("normalizedMoodsSelector", () => {
    test("when there are no events", () => {
      expect(normalizedMoodsSelector(initialState)).toEqual({
        allIds: [],
        byId: {},
      });
    });

    test("with a single create event", () => {
      expect(
        normalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:00:00.000Z"],
        byId: { "2020-10-10T08:00:00.000Z": { mood: 5 } },
      });
    });

    test("with two create events and a meditation create event", () => {
      expect(
        normalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-11T08:00:00.000Z",
              "2020-10-12T08:00:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-11T08:00:00.000Z": {
                createdAt: "2020-10-11T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-12T08:00:00.000Z": {
                createdAt: "2020-10-12T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:00:00.000Z", "2020-10-12T08:00:00.000Z"],
        byId: {
          "2020-10-10T08:00:00.000Z": { mood: 5 },
          "2020-10-12T08:00:00.000Z": { mood: 7 },
        },
      });
    });

    test("with a delete event", () => {
      expect(
        normalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 8 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z"],
        byId: { "2020-10-10T08:01:00.000Z": { mood: 8 } },
      });
    });

    test("with an update event that changes all event properties", () => {
      expect(
        normalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
              "2020-10-10T08:03:00.000Z",
              "2020-10-10T08:04:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: {
                  description: "happy",
                  exploration: "foo",
                  mood: 8,
                },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
              "2020-10-10T08:03:00.000Z": {
                createdAt: "2020-10-10T08:03:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2020-10-10T08:04:00.000Z": {
                createdAt: "2020-10-10T08:04:00.000Z",
                type: "v1/moods/update",
                payload: {
                  id: "2020-10-10T08:01:00.000Z",
                  description: "joy",
                  exploration: "bar",
                  mood: 10,
                },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z", "2020-10-10T08:03:00.000Z"],
        byId: {
          "2020-10-10T08:01:00.000Z": {
            description: "joy",
            exploration: "bar",
            mood: 10,
            updatedAt: "2020-10-10T08:04:00.000Z",
          },
          "2020-10-10T08:03:00.000Z": { mood: 7 },
        },
      });
    });

    test("with an update event that changes a single property", () => {
      expect(
        normalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:03:00.000Z",
              "2020-10-10T08:04:00.000Z",
            ],
            byId: {
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: {
                  description: "happy",
                  exploration: "foo",
                  mood: 8,
                },
              },
              "2020-10-10T08:03:00.000Z": {
                createdAt: "2020-10-10T08:03:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2020-10-10T08:04:00.000Z": {
                createdAt: "2020-10-10T08:04:00.000Z",
                type: "v1/moods/update",
                payload: {
                  id: "2020-10-10T08:01:00.000Z",
                  description: "joy",
                },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-10-10T08:01:00.000Z", "2020-10-10T08:03:00.000Z"],
        byId: {
          "2020-10-10T08:01:00.000Z": {
            description: "joy",
            exploration: "foo",
            mood: 8,
            updatedAt: "2020-10-10T08:04:00.000Z",
          },
          "2020-10-10T08:03:00.000Z": { mood: 7 },
        },
      });
    });
  });

  describe("denormalizedMeditationsSelector", () => {
    test("when there are no events", () => {
      expect(denormalizedMeditationsSelector(initialState)).toEqual([]);
    });

    test("with a single create event", () => {
      expect(
        denormalizedMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
            },
          },
        })
      ).toEqual([{ createdAt: "2020-10-10T08:00:00.000Z", seconds: 60 }]);
    });

    test("with a delete event", () => {
      expect(
        denormalizedMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 120 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/meditations/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
            },
          },
        })
      ).toEqual([{ createdAt: "2020-10-10T08:01:00.000Z", seconds: 120 }]);
    });
  });

  describe("denormalizedMoodsSelector", () => {
    test("when there are no events", () => {
      expect(denormalizedMoodsSelector(initialState)).toEqual([]);
    });

    test("with a single create event", () => {
      expect(
        denormalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual([{ createdAt: "2020-10-10T08:00:00.000Z", mood: 5 }]);
    });

    test("with a delete event", () => {
      expect(
        denormalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 8 },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
            },
          },
        })
      ).toEqual([{ createdAt: "2020-10-10T08:01:00.000Z", mood: 8 }]);
    });

    test("with an update event that changes all event properties", () => {
      expect(
        denormalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:02:00.000Z",
              "2020-10-10T08:03:00.000Z",
              "2020-10-10T08:04:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: {
                  description: "happy",
                  exploration: "foo",
                  mood: 8,
                },
              },
              "2020-10-10T08:02:00.000Z": {
                createdAt: "2020-10-10T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-10T08:00:00.000Z",
              },
              "2020-10-10T08:03:00.000Z": {
                createdAt: "2020-10-10T08:03:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2020-10-10T08:04:00.000Z": {
                createdAt: "2020-10-10T08:04:00.000Z",
                type: "v1/moods/update",
                payload: {
                  id: "2020-10-10T08:01:00.000Z",
                  description: "joy",
                  exploration: "bar",
                  mood: 10,
                },
              },
            },
          },
        })
      ).toEqual([
        {
          createdAt: "2020-10-10T08:01:00.000Z",
          description: "joy",
          exploration: "bar",
          mood: 10,
          updatedAt: "2020-10-10T08:04:00.000Z",
        },
        {
          createdAt: "2020-10-10T08:03:00.000Z",
          mood: 7,
        },
      ]);
    });

    test("with an update event that changes a single property", () => {
      expect(
        denormalizedMoodsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:01:00.000Z",
              "2020-10-10T08:03:00.000Z",
              "2020-10-10T08:04:00.000Z",
            ],
            byId: {
              "2020-10-10T08:01:00.000Z": {
                createdAt: "2020-10-10T08:01:00.000Z",
                type: "v1/moods/create",
                payload: {
                  description: "happy",
                  exploration: "foo",
                  mood: 8,
                },
              },
              "2020-10-10T08:03:00.000Z": {
                createdAt: "2020-10-10T08:03:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2020-10-10T08:04:00.000Z": {
                createdAt: "2020-10-10T08:04:00.000Z",
                type: "v1/moods/update",
                payload: {
                  id: "2020-10-10T08:01:00.000Z",
                  description: "joy",
                },
              },
            },
          },
        })
      ).toEqual([
        {
          createdAt: "2020-10-10T08:01:00.000Z",
          description: "joy",
          exploration: "foo",
          mood: 8,
          updatedAt: "2020-10-10T08:04:00.000Z",
        },
        {
          createdAt: "2020-10-10T08:03:00.000Z",
          mood: 7,
        },
      ]);
    });
  });

  describe("hasMeditationsSelector", () => {
    test("when there are no events", () => {
      expect(hasMeditationsSelector(initialState)).toBe(false);
    });

    test("when there are events but no meditation events", () => {
      expect(
        hasMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toBe(false);
    });

    test("with a single create event", () => {
      expect(
        hasMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
            },
          },
        })
      ).toBe(true);
    });

    test("with two create events and a mood create event", () => {
      expect(
        hasMeditationsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T08:00:00.000Z",
              "2020-10-11T08:00:00.000Z",
              "2020-10-12T08:00:00.000Z",
            ],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-11T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-10-12T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 120 },
              },
            },
          },
        })
      ).toBe(true);
    });
  });

  test("descriptionsSelector", () => {
    expect(
      normalizedDescriptionWordsSelector({
        ...initialState,
        events: {
          ...initialState.events,
          allIds: [
            "2020-07-10T00:00:00.000Z",
            "2020-08-10T00:00:00.000Z",
            "2020-09-10T00:00:00.000Z",
            "2020-09-11T00:00:00.000Z",
          ],
          byId: {
            "2020-07-10T00:00:00.000Z": {
              createdAt: "2020-07-10T00:00:00.000Z",
              type: "v1/moods/create",
              payload: { description: "will be overridden", mood: 5 },
            },
            "2020-08-10T00:00:00.000Z": {
              createdAt: "2020-08-10T00:00:00.000Z",
              type: "v1/moods/create",
              payload: { description: "  pIkaChu  ", mood: 5 },
            },
            "2020-09-10T00:00:00.000Z": {
              createdAt: "2020-09-10T00:00:00.000Z",
              type: "v1/moods/create",
              payload: { description: "  Bulbasaur Pikachu  🙂   ", mood: 5 },
            },
            "2020-09-11T00:00:00.000Z": {
              createdAt: "2020-09-11T00:00:00.000Z",
              type: "v1/moods/update",
              payload: {
                id: "2020-07-10T00:00:00.000Z",
                description: "charmander squirtle pikachu",
              },
            },
          },
        },
      })
    ).toEqual(["🙂", "Bulbasaur", "Charmander", "Pikachu", "Squirtle"]);
  });

  describe("moodIdsByDateSelector", () => {
    test("when there are no events", () => {
      expect(moodIdsByDateSelector(initialState)).toEqual({});
    });

    test("with a single create event", () => {
      expect(
        moodIdsByDateSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ "2020-10-10": ["2020-10-10T08:00:00.000Z"] });
    });

    test("with 3 events and a deleted event", () => {
      expect(
        moodIdsByDateSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-10-10T07:00:00.000Z",
              "2020-10-10T08:00:00.000Z",
              "2020-10-11T08:00:00.000Z",
              "2020-10-11T08:02:00.000Z",
              "2020-10-13T08:00:00.000Z",
            ],
            byId: {
              "2020-10-10T07:00:00.000Z": {
                createdAt: "2020-10-10T07:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 2 },
              },
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-10-11T08:00:00.000Z": {
                createdAt: "2020-10-11T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 10 },
              },
              "2020-10-11T08:02:00.000Z": {
                createdAt: "2020-10-11T08:02:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-10-11T08:00:00.000Z",
              },
              "2020-10-13T08:00:00.000Z": {
                createdAt: "2020-10-13T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({
        "2020-10-10": ["2020-10-10T07:00:00.000Z", "2020-10-10T08:00:00.000Z"],
        "2020-10-13": ["2020-10-13T08:00:00.000Z"],
      });
    });
  });

  describe("meditationStatsSelector", () => {
    test("with no meditations and no moods", () => {
      expect(meditationStatsSelector(initialState)).toEqual({
        averageMoodChangeAfterMeditation: undefined,
        filteredWordsAfter: {},
        filteredWordsBefore: {},
        wordsAfter: {},
        wordsBefore: {},
      });
    });

    test("with no meditations and 1 mood", () => {
      expect(
        meditationStatsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        averageMoodChangeAfterMeditation: undefined,
        filteredWordsAfter: {},
        filteredWordsBefore: {},
        wordsAfter: {},
        wordsBefore: {},
      });
    });

    test("with 1 meditation and no moods", () => {
      expect(
        meditationStatsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
            },
          },
        })
      ).toEqual({
        averageMoodChangeAfterMeditation: undefined,
        filteredWordsAfter: {},
        filteredWordsBefore: {},
        wordsAfter: {},
        wordsBefore: {},
      });
    });

    test("with 1 meditation and 2 moods", () => {
      expect(
        meditationStatsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-10-10T08:00:00.000Z", "2020-10-11T08:00:00.000Z"],
            byId: {
              "2020-10-10T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-10-11T08:00:00.000Z": {
                createdAt: "2020-10-10T08:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        averageMoodChangeAfterMeditation: undefined,
        filteredWordsAfter: {},
        filteredWordsBefore: {},
        wordsAfter: {},
        wordsBefore: {},
      });
    });

    test("handles a complex example correctly", () => {
      expect(
        meditationStatsSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: [
              "2020-01-01T11:00:00.000Z",
              "2020-01-01T12:00:00.000Z",
              "2020-01-01T13:00:00.000Z",
              "2020-01-02T11:00:00.000Z",
              "2020-01-02T12:00:00.000Z",
              "2020-01-02T13:00:00.000Z",
              "2020-01-03T11:00:00.000Z",
              "2020-01-03T12:00:00.000Z",
              "2020-01-03T13:00:00.000Z",
            ],
            byId: {
              "2020-01-01T11:00:00.000Z": {
                createdAt: "2020-01-01T11:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "Foo bar baz beforeOnly", mood: 4 },
              },
              "2020-01-01T12:00:00.000Z": {
                createdAt: "2020-01-01T12:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-01-01T13:00:00.000Z": {
                createdAt: "2020-01-01T13:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "foo bar Baz afterOnly", mood: 6 },
              },
              "2020-01-02T11:00:00.000Z": {
                createdAt: "2020-01-02T11:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "foo Bar", mood: 7 },
              },
              "2020-01-02T12:00:00.000Z": {
                createdAt: "2020-01-02T12:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-01-02T13:00:00.000Z": {
                createdAt: "2020-01-02T13:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "bar baz", mood: 7 },
              },
              "2020-01-03T11:00:00.000Z": {
                createdAt: "2020-01-03T11:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "foo", mood: 5 },
              },
              "2020-01-03T12:00:00.000Z": {
                createdAt: "2020-01-03T12:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2020-01-03T13:00:00.000Z": {
                createdAt: "2020-01-03T13:00:00.000Z",
                type: "v1/moods/create",
                payload: { description: "baz", mood: 6 },
              },
            },
          },
        })
      ).toEqual({
        averageMoodChangeAfterMeditation: 1,
        filteredWordsAfter: { Afteronly: 1, Baz: 2 },
        filteredWordsBefore: { Foo: 2, Beforeonly: 1 },
        wordsAfter: { Afteronly: 1, Foo: 1, Bar: 2, Baz: 3 },
        wordsBefore: { Foo: 3, Bar: 2, Baz: 1, Beforeonly: 1 },
      });
    });
  });

  describe("normalizedAveragesByDaySelector", () => {
    it("works with 1 mood", () => {
      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-10T00:00:00.000Z"],
            byId: {
              "2020-07-10T00:00:00.000Z": {
                createdAt: "2020-07-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-10"], byId: { "2020-07-10": 5 } });
    });

    it("works with 2 moods in the same day", () => {
      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-28T01:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T01:00:00.000Z": {
                createdAt: "2020-07-28T01:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-28"], byId: { "2020-07-28": 6 } });
    });

    it("works with 2 moods in adjacent days", () => {
      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-27T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-27T00:00:00.000Z": {
                createdAt: "2020-07-27T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-07-27", "2020-07-28"],
        byId: { "2020-07-27": 5, "2020-07-28": 5 },
      });

      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-06-10T00:00:00.000Z", "2020-06-11T00:00:00.000Z"],
            byId: {
              "2020-06-10T00:00:00.000Z": {
                createdAt: "2020-06-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-06-11T00:00:00.000Z": {
                createdAt: "2020-06-11T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-06-10",
            "2020-06-11",
          ],
          "byId": Object {
            "2020-06-10": 5.5,
            "2020-06-11": 7,
          },
        }
      `);
    });

    it("works with 2 moods in separate non-adjacent days", () => {
      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-04-08T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-04-08T00:00:00.000Z": {
                createdAt: "2020-04-08T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-04-05", "2020-04-06", "2020-04-07", "2020-04-08"],
        byId: {
          "2020-04-05": 5,
          "2020-04-06": 5,
          "2020-04-07": 5,
          "2020-04-08": 5,
        },
      });

      expect(
        normalizedAveragesByDaySelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-04-09T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-04-09T00:00:00.000Z": {
                createdAt: "2020-04-09T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 9 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-04-05",
            "2020-04-06",
            "2020-04-07",
            "2020-04-08",
            "2020-04-09",
          ],
          "byId": Object {
            "2020-04-05": 3.75,
            "2020-04-06": 5.25,
            "2020-04-07": 6.75,
            "2020-04-08": 8.25,
            "2020-04-09": 9,
          },
        }
      `);
    });
  });

  describe("normalizedAveragesByHourSelector", () => {
    it("works with 1 mood", () => {
      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-10T00:00:00.000Z"],
            byId: {
              "2020-07-10T00:00:00.000Z": {
                createdAt: "2020-07-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-07-10T00:00:00.000Z"],
        byId: { "2020-07-10T00:00:00.000Z": 5 },
      });
    });

    it("works with 2 moods in the same hour", () => {
      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-28T00:30:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:30:00.000Z": {
                createdAt: "2020-07-28T00:30:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-07-28T00:00:00.000Z"],
        byId: { "2020-07-28T00:00:00.000Z": 6 },
      });
    });

    it("works with 2 moods in adjacent hours", () => {
      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-27T00:00:00.000Z", "2020-07-27T01:00:00.000Z"],
            byId: {
              "2020-07-27T00:00:00.000Z": {
                createdAt: "2020-07-27T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-27T01:00:00.000Z": {
                createdAt: "2020-07-27T01:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-07-27T00:00:00.000Z", "2020-07-27T01:00:00.000Z"],
        byId: { "2020-07-27T00:00:00.000Z": 5, "2020-07-27T01:00:00.000Z": 5 },
      });

      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-27T00:00:00.000Z", "2020-07-27T01:00:00.000Z"],
            byId: {
              "2020-07-27T00:00:00.000Z": {
                createdAt: "2020-07-27T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-07-27T01:00:00.000Z": {
                createdAt: "2020-07-27T01:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-07-27T00:00:00.000Z",
            "2020-07-27T01:00:00.000Z",
          ],
          "byId": Object {
            "2020-07-27T00:00:00.000Z": 5.5,
            "2020-07-27T01:00:00.000Z": 7,
          },
        }
      `);
    });

    it("works with 2 moods in separate non-adjacent hours", () => {
      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-27T00:00:00.000Z", "2020-07-27T03:00:00.000Z"],
            byId: {
              "2020-07-27T00:00:00.000Z": {
                createdAt: "2020-07-27T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-27T03:00:00.000Z": {
                createdAt: "2020-07-27T03:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: [
          "2020-07-27T00:00:00.000Z",
          "2020-07-27T01:00:00.000Z",
          "2020-07-27T02:00:00.000Z",
          "2020-07-27T03:00:00.000Z",
        ],
        byId: {
          "2020-07-27T00:00:00.000Z": 5,
          "2020-07-27T01:00:00.000Z": 5,
          "2020-07-27T02:00:00.000Z": 5,
          "2020-07-27T03:00:00.000Z": 5,
        },
      });

      expect(
        normalizedAveragesByHourSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-27T00:00:00.000Z", "2020-07-27T03:00:00.000Z"],
            byId: {
              "2020-07-27T00:00:00.000Z": {
                createdAt: "2020-07-27T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-07-27T03:00:00.000Z": {
                createdAt: "2020-07-27T03:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 9 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-07-27T00:00:00.000Z",
            "2020-07-27T01:00:00.000Z",
            "2020-07-27T02:00:00.000Z",
            "2020-07-27T03:00:00.000Z",
          ],
          "byId": Object {
            "2020-07-27T00:00:00.000Z": 4,
            "2020-07-27T01:00:00.000Z": 6,
            "2020-07-27T02:00:00.000Z": 8,
            "2020-07-27T03:00:00.000Z": 9,
          },
        }
      `);
    });
  });

  describe("normalizedAveragesByMonthSelector", () => {
    it("works with 1 mood", () => {
      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-01"], byId: { "2020-07-01": 5 } });
    });

    it("works with 2 moods in the same month", () => {
      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-29T00:00:00.000Z": {
                createdAt: "2020-07-29T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-01"], byId: { "2020-07-01": 6 } });
    });

    it("works with 2 moods in adjacent months", () => {
      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-06-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-06-25T00:00:00.000Z": {
                createdAt: "2020-06-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-06-01", "2020-07-01"],
        byId: { "2020-06-01": 5, "2020-07-01": 5 },
      });

      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-06-10T00:00:00.000Z", "2020-07-10T00:00:00.000Z"],
            byId: {
              "2020-06-10T00:00:00.000Z": {
                createdAt: "2020-06-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-07-10T00:00:00.000Z": {
                createdAt: "2020-07-10T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-06-01",
            "2020-07-01",
          ],
          "byId": Object {
            "2020-06-01": 5.05,
            "2020-07-01": 6.550000000000001,
          },
        }
      `);
    });

    it("works with 2 moods in separate non-adjacent months", () => {
      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-31T00:00:00.000Z": {
                createdAt: "2020-07-31T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-04-01", "2020-05-01", "2020-06-01", "2020-07-01"],
        byId: {
          "2020-04-01": 5,
          "2020-05-01": 5,
          "2020-06-01": 5,
          "2020-07-01": 5,
        },
      });

      expect(
        normalizedAveragesByMonthSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-04-05T00:00:00.000Z", "2020-07-05T00:00:00.000Z"],
            byId: {
              "2020-04-05T00:00:00.000Z": {
                createdAt: "2020-04-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 9 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-04-01",
            "2020-05-01",
            "2020-06-01",
            "2020-07-01",
          ],
          "byId": Object {
            "2020-04-01": 3.857142857142857,
            "2020-05-01": 5.736263736263737,
            "2020-06-01": 7.747252747252748,
            "2020-07-01": 8.868131868131869,
          },
        }
      `);
    });
  });

  describe("normalizedAveragesByWeekSelector", () => {
    it("works with 1 mood", () => {
      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-27"], byId: { "2020-07-27": 5 } });
    });

    it("gets date correct", () => {
      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-08-16T22:00:00.000Z"],
            byId: {
              "2020-08-16T22:00:00.000Z": {
                createdAt: "2020-08-16T22:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-08-10"], byId: { "2020-08-10": 5 } });
    });

    it("works with 2 moods in the same week", () => {
      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-29T00:00:00.000Z": {
                createdAt: "2020-07-29T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-07-27"], byId: { "2020-07-27": 6 } });
    });

    it("works with 2 moods in adjacent weeks", () => {
      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-07-20", "2020-07-27"],
        byId: { "2020-07-20": 5, "2020-07-27": 5 },
      });

      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-07-20",
            "2020-07-27",
          ],
          "byId": Object {
            "2020-07-20": 4,
            "2020-07-27": 5.5,
          },
        }
      `);
    });

    it("works with 2 moods in separate non-adjacent weeks", () => {
      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2020-07-31T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-31T00:00:00.000Z": {
                createdAt: "2020-07-31T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: [
          "2020-06-29",
          "2020-07-06",
          "2020-07-13",
          "2020-07-20",
          "2020-07-27",
        ],
        byId: {
          "2020-06-29": 5,
          "2020-07-06": 5,
          "2020-07-13": 5,
          "2020-07-20": 5,
          "2020-07-27": 5,
        },
      });

      expect(
        normalizedAveragesByWeekSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2020-07-25T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-06-29",
            "2020-07-06",
            "2020-07-13",
            "2020-07-20",
          ],
          "byId": Object {
            "2020-06-29": 4.050000000000001,
            "2020-07-06": 4.449999999999999,
            "2020-07-13": 5.15,
            "2020-07-20": 5.75,
          },
        }
      `);
    });
  });

  describe("normalizedAveragesByYearSelector", () => {
    it("works with 1 mood", () => {
      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-01-01"], byId: { "2020-01-01": 5 } });
      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2021-07-28T00:00:00.000Z"],
            byId: {
              "2021-07-28T00:00:00.000Z": {
                createdAt: "2021-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2021-01-01"], byId: { "2021-01-01": 5 } });
    });

    it("works with 2 moods in the same year", () => {
      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
            byId: {
              "2020-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-07-29T00:00:00.000Z": {
                createdAt: "2020-07-29T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
            },
          },
        })
      ).toEqual({ allIds: ["2020-01-01"], byId: { "2020-01-01": 6 } });
    });

    it("works with 2 moods in adjacent years", () => {
      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2021-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2021-07-28T00:00:00.000Z": {
                createdAt: "2021-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-01-01", "2021-01-01"],
        byId: { "2020-01-01": 5, "2021-01-01": 5 },
      });

      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-25T00:00:00.000Z", "2021-07-28T00:00:00.000Z"],
            byId: {
              "2020-07-25T00:00:00.000Z": {
                createdAt: "2020-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 3 },
              },
              "2021-07-28T00:00:00.000Z": {
                createdAt: "2020-07-28T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-01-01",
          ],
          "byId": Object {
            "2020-01-01": 4.5,
          },
        }
      `);
    });

    it("works with 2 moods in separate non-adjacent years", () => {
      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2022-07-31T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2022-07-31T00:00:00.000Z": {
                createdAt: "2022-07-31T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
            },
          },
        })
      ).toEqual({
        allIds: ["2020-01-01", "2021-01-01", "2022-01-01"],
        byId: { "2020-01-01": 5, "2021-01-01": 5, "2022-01-01": 5 },
      });

      expect(
        normalizedAveragesByYearSelector({
          ...initialState,
          events: {
            ...initialState.events,
            allIds: ["2020-07-05T00:00:00.000Z", "2022-07-25T00:00:00.000Z"],
            byId: {
              "2020-07-05T00:00:00.000Z": {
                createdAt: "2020-07-05T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
              "2022-07-25T00:00:00.000Z": {
                createdAt: "2022-07-25T00:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 6 },
              },
            },
          },
        })
      ).toMatchInlineSnapshot(`
        Object {
          "allIds": Array [
            "2020-01-01",
            "2021-01-01",
            "2022-01-01",
          ],
          "byId": Object {
            "2020-01-01": 4.24,
            "2021-01-01": 4.966666666666667,
            "2022-01-01": 5.726666666666667,
          },
        }
      `);
    });
  });
});
