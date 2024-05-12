import store, { RootState } from ".";
import eventsSlice from "./eventsSlice";

describe("eventsSlice", () => {
  let initialState: RootState["events"];
  let stateWithEvents: RootState["events"];

  beforeEach(() => {
    initialState = eventsSlice.getInitialState();

    stateWithEvents = {
      ...eventsSlice.getInitialState(),
      allIds: ["2020-05-07T19:36:00.000Z", "2020-05-07T20:31:00.000Z"],
      byId: {
        "2020-05-07T19:36:00.000Z": {
          createdAt: "2020-05-07T19:36:00.000Z",
          type: "v1/moods/create",
          payload: { mood: 4 },
        },
        "2020-05-07T20:31:00.000Z": {
          createdAt: "2020-05-07T20:31:00.000Z",
          type: "v1/moods/delete",
          payload: "2020-05-07T19:36:00.000Z",
        },
      },
      hasLoadedFromServer: true,
      idsToSync: ["2020-05-07T20:31:00.000Z"],
      nextCursor: "test-cursor-123",
    };
  });

  test("initial state", () => {
    expect(store.getState().events).toEqual(initialState);
  });

  describe("trackedCategoriesSelector.all", () => {
    test("initial state", () => {
      expect(
        eventsSlice.selectors.trackedCategories({
          events: eventsSlice.getInitialState(),
        }).all,
      ).toEqual({ allIds: [], byId: {} });
    });

    test("multiple events", () => {
      expect(
        eventsSlice.selectors.trackedCategories({
          events: {
            ...eventsSlice.getInitialState(),
            allIds: [
              "2024-04-01T00:00:00.000Z",
              "2024-04-01T01:00:00.000Z",
              "2024-04-01T02:00:00.000Z",
              "2024-04-01T03:00:00.000Z",
              "2024-04-01T04:00:00.000Z",
              "2024-04-01T05:00:00.000Z",
              "2024-04-01T06:00:00.000Z",
            ],
            byId: {
              "2024-04-01T00:00:00.000Z": {
                createdAt: "2024-04-01T00:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 60 },
              },
              "2024-04-01T01:00:00.000Z": {
                createdAt: "2024-04-01T01:00:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              "2024-04-01T02:00:00.000Z": {
                createdAt: "2024-04-01T02:00:00.000Z",
                type: "v1/weights/create",
                payload: { value: 70 },
              },
              "2024-04-01T03:00:00.000Z": {
                createdAt: "2024-04-01T03:00:00.000Z",
                type: "v1/sleeps/create",
                payload: { dateAwoke: "2024-04-01", minutesSlept: 480 },
              },
              "2024-04-01T04:00:00.000Z": {
                createdAt: "2024-04-01T04:00:00.000Z",
                type: "v1/meditations/delete",
                payload: "2024-04-01T00:00:00.000Z",
              },
              "2024-04-01T05:00:00.000Z": {
                createdAt: "2024-04-01T05:00:00.000Z",
                type: "v1/moods/update",
                payload: {
                  id: "2024-04-01T01:00:00.000Z",
                  mood: 8,
                },
              },
              "2024-04-01T06:00:00.000Z": {
                createdAt: "2024-04-01T06:00:00.000Z",
                type: "v1/meditations/create",
                payload: { seconds: 90 },
              },
            },
          },
        }).all,
      ).toEqual({
        allIds: [
          "2024-04-01T01:00:00.000Z",
          "2024-04-01T02:00:00.000Z",
          "2024-04-01T03:00:00.000Z",
          "2024-04-01T06:00:00.000Z",
        ],
        byId: {
          "2024-04-01T01:00:00.000Z": {
            mood: 8,
            type: "moods",
            updatedAt: "2024-04-01T05:00:00.000Z",
          },
          "2024-04-01T02:00:00.000Z": {
            type: "weights",
            value: 70,
          },
          "2024-04-01T03:00:00.000Z": {
            dateAwoke: "2024-04-01",
            minutesSlept: 480,
            type: "sleeps",
          },
          "2024-04-01T06:00:00.000Z": {
            seconds: 90,
            type: "meditations",
          },
        },
      });
    });
  });

  describe("actions", () => {
    beforeEach(() => {
      store.dispatch(eventsSlice.actions.clear());
    });

    describe("add", () => {
      test("when there are no events in state", () => {
        store.dispatch(
          eventsSlice.actions.add({
            createdAt: "2020-05-07T19:53:00.000Z",
            type: "v1/moods/create",
            payload: { mood: 7 },
          }),
        );
        expect(store.getState().events).toEqual({
          ...initialState,
          allIds: ["2020-05-07T19:53:00.000Z"],
          byId: {
            "2020-05-07T19:53:00.000Z": {
              createdAt: "2020-05-07T19:53:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 7 },
            },
          },
          hasLoadedFromServer: false,
          idsToSync: ["2020-05-07T19:53:00.000Z"],
        });
      });

      describe("when there are events in state", () => {
        beforeEach(() => {
          store.dispatch(
            eventsSlice.actions.loadFromStorage({
              allIds: ["2020-05-07T19:39:00.000Z"],
              byId: {
                "2020-05-07T19:39:00.000Z": {
                  createdAt: "2020-05-07T19:39:00.000Z",
                  type: "v1/moods/create",
                  payload: { mood: 5 },
                },
              },
              hasLoadedFromServer: true,
              idsToSync: ["2020-05-07T19:39:00.000Z"],
              nextCursor: "test-cursor-123",
            }),
          );
        });

        test("v1/moods/create", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            }),
          );
          expect(store.getState().events).toEqual({
            ...initialState,
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:34:00.000Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": {
                createdAt: "2020-05-07T19:39:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-05-07T20:34:00.000Z": {
                createdAt: "2020-05-07T20:34:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
            hasLoadedFromServer: true,
            idsToSync: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:34:00.000Z"],
            nextCursor: "test-cursor-123",
          });
        });

        test("v1/moods/update", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "v1/moods/update",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 5 },
            }),
          );
          expect(store.getState().events).toEqual({
            ...initialState,
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:34:00.000Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": {
                createdAt: "2020-05-07T19:39:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-05-07T20:34:00.000Z": {
                createdAt: "2020-05-07T20:34:00.000Z",
                type: "v1/moods/update",
                payload: { id: "2020-05-07T20:32:00.000Z", mood: 5 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:34:00.000Z"],
            nextCursor: "test-cursor-123",
          });
        });
      });

      // This could happen due to clock skew on an event that has come from the server
      describe("when there is an event in state that is newer than the created event", () => {
        beforeEach(() => {
          store.dispatch(
            eventsSlice.actions.loadFromStorage({
              allIds: ["2020-05-07T19:39:00.000Z"],
              byId: {
                "2020-05-07T19:39:00.000Z": {
                  createdAt: "2020-05-07T19:39:00.000Z",
                  type: "v1/moods/create",
                  payload: { mood: 5 },
                },
              },
              hasLoadedFromServer: true,
              idsToSync: ["2020-05-07T19:39:00.000Z"],
              nextCursor: "test-cursor-123",
            }),
          );
        });

        test("v1/moods/create", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T19:38:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 4 },
            }),
          );
          expect(store.getState().events).toEqual({
            ...initialState,
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": {
                createdAt: "2020-05-07T19:39:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-05-07T19:39:00.001Z": {
                createdAt: "2020-05-07T19:39:00.001Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            nextCursor: "test-cursor-123",
          });
        });

        test("v1/moods/delete", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T19:38:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            }),
          );
          expect(store.getState().events).toEqual({
            ...initialState,
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": {
                createdAt: "2020-05-07T19:39:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-05-07T19:39:00.001Z": {
                createdAt: "2020-05-07T19:39:00.001Z",
                type: "v1/moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
            hasLoadedFromServer: true,
            idsToSync: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            nextCursor: "test-cursor-123",
          });
        });

        test("v1/moods/update", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T19:38:00.000Z",
              type: "v1/moods/update",
              payload: { id: "2020-05-07T19:39:00.000Z", mood: 7 },
            }),
          );
          expect(store.getState().events).toEqual({
            ...initialState,
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": {
                createdAt: "2020-05-07T19:39:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 5 },
              },
              "2020-05-07T19:39:00.001Z": {
                createdAt: "2020-05-07T19:39:00.001Z",
                type: "v1/moods/update",
                payload: { id: "2020-05-07T19:39:00.000Z", mood: 7 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: ["2020-05-07T19:39:00.000Z", "2020-05-07T19:39:00.001Z"],
            nextCursor: "test-cursor-123",
          });
        });
      });
    });

    test("clear", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      expect(store.getState().events).toEqual(stateWithEvents);
      store.dispatch(eventsSlice.actions.clear());
      expect(store.getState().events).toEqual(initialState);
    });

    test("loadFromStorage", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      expect(store.getState().events).toEqual(stateWithEvents);
    });

    test("syncFromServerStart", () => {
      const expectedState = {
        ...stateWithEvents,
        isSyncingFromServer: true,
        syncFromServerError: false,
      };
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      expect(store.getState().events).toEqual(expectedState);
      store.dispatch(eventsSlice.actions.syncFromServerError());
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      expect(store.getState().events).toEqual(expectedState);
    });

    test("syncFromServerError", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      store.dispatch(eventsSlice.actions.syncFromServerError());
      expect(store.getState().events).toEqual({
        ...stateWithEvents,
        isSyncingFromServer: false,
        syncFromServerError: true,
      });
    });

    describe("syncFromServerSuccess", () => {
      test("when there are no events in state and no server events", () => {
        store.dispatch(
          eventsSlice.actions.syncFromServerSuccess({
            cursor: "cursor-789",
            events: [],
          }),
        );
        expect(store.getState().events).toEqual({
          ...initialState,
          hasLoadedFromServer: true,
          nextCursor: "cursor-789",
        });
      });

      test("when there are events in state and no server events", () => {
        store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
        store.dispatch(
          eventsSlice.actions.syncFromServerSuccess({
            cursor: "cursor-789",
            events: [],
          }),
        );
        expect(store.getState().events).toEqual({
          ...stateWithEvents,
          nextCursor: "cursor-789",
        });
      });

      test("when there are no events in state and some server events", () => {
        store.dispatch(
          eventsSlice.actions.syncFromServerSuccess({
            cursor: "cursor-456",
            events: [
              {
                createdAt: "2020-05-07T19:53:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 7 },
              },
              {
                createdAt: "2020-05-07T19:55:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-05-07T19:53:00.000Z",
              },
              {
                createdAt: "2020-05-07T19:56:00.000Z",
                type: "v1/moods/create",
                payload: { mood: 8 },
              },
            ],
          }),
        );
        expect(store.getState().events).toEqual({
          ...initialState,
          allIds: [
            "2020-05-07T19:53:00.000Z",
            "2020-05-07T19:55:00.000Z",
            "2020-05-07T19:56:00.000Z",
          ],
          byId: {
            "2020-05-07T19:53:00.000Z": {
              createdAt: "2020-05-07T19:53:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 7 },
            },
            "2020-05-07T19:55:00.000Z": {
              createdAt: "2020-05-07T19:55:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:53:00.000Z",
            },
            "2020-05-07T19:56:00.000Z": {
              createdAt: "2020-05-07T19:56:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 8 },
            },
          },
          hasLoadedFromServer: true,
          idsToSync: [],
          nextCursor: "cursor-456",
        });
      });

      test("when there are events in state and some server events", () => {
        store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
        store.dispatch(
          eventsSlice.actions.syncFromServerSuccess({
            cursor: "cursor-567",
            events: [
              {
                createdAt: "2020-05-07T19:35:00.000Z",
                payload: { mood: 7 },
                type: "v1/moods/create",
              },
              {
                createdAt: "2020-05-07T19:45:00.000Z",
                payload: { mood: 8 },
                type: "v1/moods/create",
              },
              {
                createdAt: "2020-05-07T20:35:00.000Z",
                payload: { mood: 9 },
                type: "v1/moods/create",
              },
            ],
          }),
        );
        expect(store.getState().events).toEqual({
          ...initialState,
          allIds: [
            "2020-05-07T19:35:00.000Z",
            "2020-05-07T19:36:00.000Z",
            "2020-05-07T19:45:00.000Z",
            "2020-05-07T20:31:00.000Z",
            "2020-05-07T20:35:00.000Z",
          ],
          byId: {
            "2020-05-07T19:35:00.000Z": {
              createdAt: "2020-05-07T19:35:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 7 },
            },
            "2020-05-07T19:36:00.000Z": {
              createdAt: "2020-05-07T19:36:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 4 },
            },
            "2020-05-07T19:45:00.000Z": {
              createdAt: "2020-05-07T19:45:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 8 },
            },
            "2020-05-07T20:31:00.000Z": {
              createdAt: "2020-05-07T20:31:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:36:00.000Z",
            },
            "2020-05-07T20:35:00.000Z": {
              createdAt: "2020-05-07T20:35:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 9 },
            },
          },
          hasLoadedFromServer: true,
          idsToSync: ["2020-05-07T20:31:00.000Z"],
          nextCursor: "cursor-567",
        });
      });
    });

    test("syncToServerStart", () => {
      const expectedState = {
        ...stateWithEvents,
        isSyncingToServer: true,
        syncToServerError: false,
      };
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncToServerStart());
      expect(store.getState().events).toEqual(expectedState);
      store.dispatch(eventsSlice.actions.syncToServerError());
      store.dispatch(eventsSlice.actions.syncToServerStart());
      expect(store.getState().events).toEqual(expectedState);
    });

    test("syncToServerError", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncToServerStart());
      store.dispatch(eventsSlice.actions.syncToServerError());
      expect(store.getState().events).toEqual({
        ...stateWithEvents,
        isSyncingToServer: false,
        syncToServerError: true,
      });
    });

    test("syncToServerSuccess", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncToServerStart());
      store.dispatch(eventsSlice.actions.syncToServerError());
      store.dispatch(eventsSlice.actions.syncToServerStart());
      store.dispatch(eventsSlice.actions.syncToServerSuccess());
      expect(store.getState().events).toEqual({
        ...stateWithEvents,
        idsToSync: [],
        isSyncingToServer: false,
        syncToServerError: false,
      });
    });
  });

  describe("selectors", () => {
    let initialState: RootState;
    let stateWithOnlyCreateEvents: RootState;

    beforeAll(() => {
      initialState = store.getState();
      stateWithOnlyCreateEvents = {
        ...initialState,
        events: {
          ...initialState.events,
          allIds: [
            "2020-10-10T08:00:00.000Z",
            "2020-10-11T08:00:00.000Z",
            "2020-10-12T08:00:00.000Z",
            "2022-09-18T09:00:00.000Z",
            "2022-09-18T12:00:00.000Z",
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
            "2022-09-18T09:00:00.000Z": {
              createdAt: "2022-09-18T09:00:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 7 },
            },
            "2022-09-18T12:00:00.000Z": {
              createdAt: "2022-09-18T12:00:00.000Z",
              type: "v1/weights/create",
              payload: { value: 70 },
            },
          },
        },
      };
    });

    describe("normalizedMeditations", () => {
      test("when there are no events", () => {
        expect(
          eventsSlice.selectors.normalizedMeditations(initialState),
        ).toEqual({
          allIds: [],
          byId: {},
        });
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.normalizedMeditations({
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
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:00:00.000Z"],
          byId: { "2020-10-10T08:00:00.000Z": { seconds: 60 } },
        });
      });

      test("with a selection of create events", () => {
        expect(
          eventsSlice.selectors.normalizedMeditations(
            stateWithOnlyCreateEvents,
          ),
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
          eventsSlice.selectors.normalizedMeditations({
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
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:01:00.000Z"],
          byId: { "2020-10-10T08:01:00.000Z": { seconds: 120 } },
        });
      });
    });

    describe("normalizedMoods", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.normalizedMoods(initialState)).toEqual({
          allIds: [],
          byId: {},
        });
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.normalizedMoods({
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
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:00:00.000Z"],
          byId: { "2020-10-10T08:00:00.000Z": { mood: 5 } },
        });
      });

      test("with a selection of create events", () => {
        expect(
          eventsSlice.selectors.normalizedMoods(stateWithOnlyCreateEvents),
        ).toEqual({
          allIds: ["2020-10-11T08:00:00.000Z", "2022-09-18T09:00:00.000Z"],
          byId: {
            "2020-10-11T08:00:00.000Z": { mood: 5 },
            "2022-09-18T09:00:00.000Z": { mood: 7 },
          },
        });
      });

      test("with a delete event", () => {
        expect(
          eventsSlice.selectors.normalizedMoods({
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
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:01:00.000Z"],
          byId: { "2020-10-10T08:01:00.000Z": { mood: 8 } },
        });
      });

      test("with an update event that changes all event properties", () => {
        expect(
          eventsSlice.selectors.normalizedMoods({
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
          }),
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
          eventsSlice.selectors.normalizedMoods({
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
          }),
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

    describe("normalizedWeights", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.normalizedWeights(initialState)).toEqual({
          allIds: [],
          byId: {},
        });
      });

      test("with a selection of create events", () => {
        expect(
          eventsSlice.selectors.normalizedWeights(stateWithOnlyCreateEvents),
        ).toEqual({
          allIds: ["2022-09-18T12:00:00.000Z"],
          byId: {
            "2022-09-18T12:00:00.000Z": { value: 70 },
          },
        });
      });

      test("update", () => {
        expect(
          eventsSlice.selectors.normalizedWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:01:00.000Z", "2020-10-10T08:04:00.000Z"],
              byId: {
                "2020-10-10T08:01:00.000Z": {
                  createdAt: "2020-10-10T08:01:00.000Z",
                  type: "v1/weights/create",
                  payload: {
                    location: { accuracy: 1, latitude: 2, longitude: 3 },
                    value: 70,
                  },
                },
                "2020-10-10T08:04:00.000Z": {
                  createdAt: "2020-10-10T08:04:00.000Z",
                  type: "v1/weights/update",
                  payload: {
                    id: "2020-10-10T08:01:00.000Z",
                    value: 80,
                  },
                },
              },
            },
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:01:00.000Z"],
          byId: {
            "2020-10-10T08:01:00.000Z": {
              location: { accuracy: 1, latitude: 2, longitude: 3 },
              updatedAt: "2020-10-10T08:04:00.000Z",
              value: 80,
            },
          },
        });
      });

      test("with a delete event", () => {
        expect(
          eventsSlice.selectors.normalizedWeights({
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
                  type: "v1/weights/create",
                  payload: { value: 60 },
                },
                "2020-10-10T08:01:00.000Z": {
                  createdAt: "2020-10-10T08:01:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 70 },
                },
                "2020-10-10T08:02:00.000Z": {
                  createdAt: "2020-10-10T08:02:00.000Z",
                  type: "v1/weights/delete",
                  payload: "2020-10-10T08:00:00.000Z",
                },
              },
            },
          }),
        ).toEqual({
          allIds: ["2020-10-10T08:01:00.000Z"],
          byId: { "2020-10-10T08:01:00.000Z": { value: 70 } },
        });
      });
    });

    describe("denormalizedMeditations", () => {
      test("when there are no events", () => {
        expect(
          eventsSlice.selectors.denormalizedMeditations(initialState),
        ).toEqual([]);
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.denormalizedMeditations({
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
          }),
        ).toEqual([{ createdAt: "2020-10-10T08:00:00.000Z", seconds: 60 }]);
      });

      test("with a delete event", () => {
        expect(
          eventsSlice.selectors.denormalizedMeditations({
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
          }),
        ).toEqual([{ createdAt: "2020-10-10T08:01:00.000Z", seconds: 120 }]);
      });
    });

    describe("denormalizedMoods", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.denormalizedMoods(initialState)).toEqual(
          [],
        );
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.denormalizedMoods({
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
          }),
        ).toEqual([{ createdAt: "2020-10-10T08:00:00.000Z", mood: 5 }]);
      });

      test("with a delete event", () => {
        expect(
          eventsSlice.selectors.denormalizedMoods({
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
          }),
        ).toEqual([{ createdAt: "2020-10-10T08:01:00.000Z", mood: 8 }]);
      });

      test("with an update event that changes all event properties", () => {
        expect(
          eventsSlice.selectors.denormalizedMoods({
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
          }),
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
          eventsSlice.selectors.denormalizedMoods({
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
          }),
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

    describe("denormalizedWeights", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.denormalizedWeights(initialState)).toEqual(
          [],
        );
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.denormalizedWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 50 },
                },
              },
            },
          }),
        ).toEqual([{ createdAt: "2020-10-10T08:00:00.000Z", value: 50 }]);
      });

      test("with a delete event", () => {
        expect(
          eventsSlice.selectors.denormalizedWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z", "2020-10-10T08:02:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 50 },
                },
                "2020-10-10T08:02:00.000Z": {
                  createdAt: "2020-10-10T08:02:00.000Z",
                  type: "v1/weights/delete",
                  payload: "2020-10-10T08:00:00.000Z",
                },
              },
            },
          }),
        ).toEqual([]);
      });

      test("with an update event", () => {
        expect(
          eventsSlice.selectors.denormalizedWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:01:00.000Z", "2020-10-10T08:04:00.000Z"],
              byId: {
                "2020-10-10T08:01:00.000Z": {
                  createdAt: "2020-10-10T08:01:00.000Z",
                  type: "v1/weights/create",
                  payload: {
                    value: 80,
                  },
                },
                "2020-10-10T08:04:00.000Z": {
                  createdAt: "2020-10-10T08:04:00.000Z",
                  type: "v1/weights/update",
                  payload: {
                    id: "2020-10-10T08:01:00.000Z",
                    value: 70,
                  },
                },
              },
            },
          }),
        ).toEqual([
          {
            createdAt: "2020-10-10T08:01:00.000Z",
            updatedAt: "2020-10-10T08:04:00.000Z",
            value: 70,
          },
        ]);
      });
    });

    describe("hasMoods", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.hasMoods(initialState)).toBe(false);
      });

      test("when there are events but no mood events", () => {
        expect(
          eventsSlice.selectors.hasMoods({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 60 },
                },
              },
            },
          }),
        ).toBe(false);
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.hasMoods({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/moods/create",
                  payload: { mood: 7 },
                },
              },
            },
          }),
        ).toBe(true);
      });

      test("with a deleted event", () => {
        expect(
          eventsSlice.selectors.hasMoods({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z", "2020-10-11T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/moods/create",
                  payload: { mood: 7 },
                },
                "2020-10-11T08:00:00.000Z": {
                  createdAt: "2020-10-11T08:00:00.000Z",
                  type: "v1/moods/delete",
                  payload: "2020-10-10T08:00:00.000Z",
                },
              },
            },
          }),
        ).toBe(false);
      });

      test("with a selection of create events", () => {
        expect(
          eventsSlice.selectors.hasWeights(stateWithOnlyCreateEvents),
        ).toBe(true);
      });
    });

    describe("hasMeditations", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.hasMeditations(initialState)).toBe(false);
      });

      test("when there are events but no meditation events", () => {
        expect(
          eventsSlice.selectors.hasMeditations({
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
          }),
        ).toBe(false);
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.hasMeditations({
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
          }),
        ).toBe(true);
      });

      test("with two create events and a mood create event", () => {
        expect(
          eventsSlice.selectors.hasMeditations({
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
          }),
        ).toBe(true);
      });
    });

    describe("hasWeights", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.hasWeights(initialState)).toBe(false);
      });

      test("when there are events but no meditation events", () => {
        expect(
          eventsSlice.selectors.hasWeights({
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
          }),
        ).toBe(false);
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.hasWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 70 },
                },
              },
            },
          }),
        ).toBe(true);
      });

      test("with a deleted event", () => {
        expect(
          eventsSlice.selectors.hasWeights({
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-10-10T08:00:00.000Z", "2020-10-11T08:00:00.000Z"],
              byId: {
                "2020-10-10T08:00:00.000Z": {
                  createdAt: "2020-10-10T08:00:00.000Z",
                  type: "v1/weights/create",
                  payload: { value: 70 },
                },
                "2020-10-11T08:00:00.000Z": {
                  createdAt: "2020-10-11T08:00:00.000Z",
                  type: "v1/weights/delete",
                  payload: "2020-10-10T08:00:00.000Z",
                },
              },
            },
          }),
        ).toBe(false);
      });

      test("with a selection of create events", () => {
        expect(
          eventsSlice.selectors.hasWeights(stateWithOnlyCreateEvents),
        ).toBe(true);
      });
    });

    test("descriptions", () => {
      expect(
        eventsSlice.selectors.normalizedDescriptionWords({
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
        }),
      ).toEqual(["🙂", "Bulbasaur", "Charmander", "Pikachu", "Squirtle"]);
    });

    describe("meanWeightInPeriod", () => {
      test("when there are no events", () => {
        expect(
          eventsSlice.selectors.meanWeightInPeriod(
            initialState,
            new Date("2020-01-01"),
            new Date("2023-01-01"),
          ),
        ).toBe(undefined);
      });

      test("when there are no events that match the date range", () => {
        expect(
          eventsSlice.selectors.meanWeightInPeriod(
            {
              ...initialState,
              events: {
                ...initialState.events,
                allIds: ["2020-01-01T00:00:00.000Z"],
                byId: {
                  "2020-01-01T00:00:00.000Z": {
                    createdAt: "2020-01-01T00:00:00.000Z",
                    type: "v1/weights/create",
                    payload: { value: 70 },
                  },
                },
              },
            },
            new Date("2020-01-02"),
            new Date("2023-01-01"),
          ),
        ).toBe(undefined);
      });

      test("when there are events that match the date range", () => {
        expect(
          eventsSlice.selectors.meanWeightInPeriod(
            {
              ...initialState,
              events: {
                ...initialState.events,
                allIds: [
                  "2020-01-01T00:00:00.000Z",
                  "2020-01-02T00:00:00.000Z",
                  "2020-01-03T00:00:00.000Z",
                ],
                byId: {
                  "2020-01-01T00:00:00.000Z": {
                    createdAt: "2020-01-01T00:00:00.000Z",
                    type: "v1/weights/create",
                    payload: { value: 10 },
                  },
                  "2020-01-02T00:00:00.000Z": {
                    createdAt: "2020-01-02T00:00:00.000Z",
                    type: "v1/weights/create",
                    payload: { value: 50 },
                  },
                  "2020-01-03T00:00:00.000Z": {
                    createdAt: "2020-01-03T00:00:00.000Z",
                    type: "v1/weights/create",
                    payload: { value: 70 },
                  },
                },
              },
            },
            new Date("2020-01-02"),
            new Date("2023-01-01"),
          ),
        ).toBe(60);
      });
    });

    describe("moodIdsByDate", () => {
      test("when there are no events", () => {
        expect(eventsSlice.selectors.moodIdsByDate(initialState)).toEqual({});
      });

      test("with a single create event", () => {
        expect(
          eventsSlice.selectors.moodIdsByDate({
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
          }),
        ).toEqual({ "2020-10-10": ["2020-10-10T08:00:00.000Z"] });
      });

      test("with 3 events and a deleted event", () => {
        expect(
          eventsSlice.selectors.moodIdsByDate({
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
          }),
        ).toEqual({
          "2020-10-10": [
            "2020-10-10T07:00:00.000Z",
            "2020-10-10T08:00:00.000Z",
          ],
          "2020-10-13": ["2020-10-13T08:00:00.000Z"],
        });
      });
    });

    describe("meanMoodsByDay", () => {
      it("works with 1 mood", () => {
        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toEqual({ "2020-07-10": 5 });
      });

      it("works with 2 moods in the same day", () => {
        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toEqual({ "2020-07-28": 6 });
      });

      it("works with 2 moods in adjacent days", () => {
        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toEqual({ "2020-07-27": 5, "2020-07-28": 5 });

        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-06-10": 5.5,
  "2020-06-11": 7,
}
`);
      });

      it("works with 2 moods in separate non-adjacent days", () => {
        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toEqual({
          "2020-04-05": 5,
          "2020-04-06": 5,
          "2020-04-07": 5,
          "2020-04-08": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByDay({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-04-05": 3.75,
  "2020-04-06": 5.25,
  "2020-04-07": 6.75,
  "2020-04-08": 8.25,
  "2020-04-09": 9,
}
`);
      });
    });

    describe("meanMoodsByHour", () => {
      it("works with 1 mood", () => {
        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toEqual({ "2020-07-10T00:00:00.000Z": 5 });
      });

      it("works with 2 moods in the same hour", () => {
        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toEqual({ "2020-07-28T00:00:00.000Z": 6 });
      });

      it("works with 2 moods in adjacent hours", () => {
        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toEqual({
          "2020-07-27T00:00:00.000Z": 5,
          "2020-07-27T01:00:00.000Z": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-07-27T00:00:00.000Z": 5.5,
  "2020-07-27T01:00:00.000Z": 7,
}
`);
      });

      it("works with 2 moods in separate non-adjacent hours", () => {
        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toEqual({
          "2020-07-27T00:00:00.000Z": 5,
          "2020-07-27T01:00:00.000Z": 5,
          "2020-07-27T02:00:00.000Z": 5,
          "2020-07-27T03:00:00.000Z": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByHour({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-07-27T00:00:00.000Z": 4,
  "2020-07-27T01:00:00.000Z": 6,
  "2020-07-27T02:00:00.000Z": 8,
  "2020-07-27T03:00:00.000Z": 9,
}
`);
      });
    });

    describe("meanMoodsByMonth", () => {
      it("works with 1 mood", () => {
        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toEqual({ "2020-07-01": 5 });
      });

      it("works with 2 moods in the same month", () => {
        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toEqual({ "2020-07-01": 6 });
      });

      it("works with 2 moods in adjacent months", () => {
        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toEqual({ "2020-06-01": 5, "2020-07-01": 5 });

        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-06-01": 5.05,
  "2020-07-01": 6.550000000000001,
}
`);
      });

      it("works with 2 moods in separate non-adjacent months", () => {
        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toEqual({
          "2020-04-01": 5,
          "2020-05-01": 5,
          "2020-06-01": 5,
          "2020-07-01": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByMonth({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-04-01": 3.857142857142857,
  "2020-05-01": 5.736263736263737,
  "2020-06-01": 7.747252747252748,
  "2020-07-01": 8.868131868131869,
}
`);
      });
    });

    describe("meanMoodsByWeek", () => {
      it("works with 1 mood", () => {
        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toEqual({ "2020-07-27": 5 });
      });

      it("gets date correct", () => {
        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toEqual({ "2020-08-10": 5 });
      });

      it("works with 2 moods in the same week", () => {
        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toEqual({ "2020-07-27": 6 });
      });

      it("works with 2 moods in adjacent weeks", () => {
        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toEqual({ "2020-07-20": 5, "2020-07-27": 5 });

        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-07-20": 4,
  "2020-07-27": 5.5,
}
`);
      });

      it("works with 2 moods in separate non-adjacent weeks", () => {
        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toEqual({
          "2020-06-29": 5,
          "2020-07-06": 5,
          "2020-07-13": 5,
          "2020-07-20": 5,
          "2020-07-27": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByWeek({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-06-29": 4.050000000000001,
  "2020-07-06": 4.449999999999999,
  "2020-07-13": 5.15,
  "2020-07-20": 5.75,
}
`);
      });
    });

    describe("meanMoodsByYear", () => {
      it("works with 1 mood", () => {
        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toEqual({ "2020-01-01": 5 });
        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toEqual({ "2021-01-01": 5 });
      });

      it("works with 2 moods in the same year", () => {
        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toEqual({ "2020-01-01": 6 });
      });

      it("works with 2 moods in adjacent years", () => {
        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toEqual({
          "2020-01-01": 5,
          "2021-01-01": 5,
        });

        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-01-01": 4.5,
}
`);
      });

      it("works with 2 moods in separate non-adjacent years", () => {
        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toEqual({ "2020-01-01": 5, "2021-01-01": 5, "2022-01-01": 5 });

        expect(
          eventsSlice.selectors.meanMoodsByYear({
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
          }),
        ).toMatchInlineSnapshot(`
{
  "2020-01-01": 4.24,
  "2021-01-01": 4.966666666666667,
  "2022-01-01": 5.726666666666667,
}
`);
      });
    });

    describe("secondsMeditatedInPeriod", () => {
      describe("when the dateFrom is after the dateTo", () => {
        it("throws an error", () => {
          expect(() =>
            eventsSlice.selectors.secondsMeditatedInPeriod(
              initialState,
              new Date("2020-07-31T00:00:00.000Z"),
              new Date("2020-07-30T00:00:00.000Z"),
            ),
          ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
        });
      });

      describe("when there are 0 meditations", () => {
        it("returns 0", () => {
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              initialState,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-31T00:00:00.000Z"),
            ),
          ).toBe(0);
        });
      });

      describe("when there is 1 meditation", () => {
        let state: RootState;

        beforeEach(() => {
          state = {
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": {
                  createdAt: "2020-07-28T00:00:00.000Z",
                  type: "v1/meditations/create",
                  payload: { seconds: 120 },
                },
              },
            },
          };
        });

        it("returns the total seconds when the meditation is within the interval", () => {
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-28T00:00:00.000Z"),
            ),
          ).toEqual(120);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-07-28T00:00:00.000Z"),
            ),
          ).toEqual(120);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toEqual(120);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toEqual(120);
        });

        it("returns 0 when the meditation does not lie within the interval", () => {
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-25T00:00:00.000Z"),
              new Date("2020-07-25T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-24T00:00:00.000Z"),
              new Date("2020-07-25T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-30T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.secondsMeditatedInPeriod(
              state,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-31T00:00:00.000Z"),
            ),
          ).toBe(0);
        });
      });
    });

    describe("totalPushUpsInPeriod", () => {
      describe("when the dateFrom is after the dateTo", () => {
        it("throws an error", () => {
          expect(() =>
            eventsSlice.selectors.totalPushUpsInPeriod(
              initialState,
              new Date("2020-07-31T00:00:00.000Z"),
              new Date("2020-07-30T00:00:00.000Z"),
            ),
          ).toThrow(Error("`dateFrom` should not be after `dateTo`"));
        });
      });

      describe("when there are 0 push-ups", () => {
        it("returns 0", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              initialState,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-31T00:00:00.000Z"),
            ),
          ).toBe(0);
        });
      });

      describe("when there is 1 push-up", () => {
        let state: RootState;

        beforeEach(() => {
          state = {
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": {
                  createdAt: "2020-07-28T00:00:00.000Z",
                  type: "v1/push-ups/create",
                  payload: { value: 1 },
                },
              },
            },
          };
        });

        it("returns the total push-ups when the push-up is within the interval", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-28T00:00:00.000Z"),
            ),
          ).toBe(1);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-07-28T00:00:00.000Z"),
            ),
          ).toBe(1);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toBe(1);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toBe(1);
        });

        it("returns 0 when the push-up does not lie within the interval", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-25T00:00:00.000Z"),
              new Date("2020-07-25T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-24T00:00:00.000Z"),
              new Date("2020-07-25T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-30T00:00:00.000Z"),
            ),
          ).toBe(0);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-30T00:00:00.000Z"),
              new Date("2020-07-31T00:00:00.000Z"),
            ),
          ).toBe(0);
        });
      });

      describe("when there are multiple push-ups", () => {
        let state: RootState;
        let stateB: RootState;

        beforeEach(() => {
          state = {
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-07-28T00:00:00.000Z", "2020-07-29T00:00:00.000Z"],
              byId: {
                "2020-07-28T00:00:00.000Z": {
                  createdAt: "2020-07-28T00:00:00.000Z",
                  type: "v1/push-ups/create",
                  payload: { value: 1 },
                },
                "2020-07-29T00:00:00.000Z": {
                  createdAt: "2020-07-29T00:00:00.000Z",
                  type: "v1/push-ups/create",
                  payload: { value: 2 },
                },
              },
            },
          };

          stateB = {
            ...initialState,
            events: {
              ...initialState.events,
              allIds: ["2020-07-24T00:00:00.000Z", "2020-07-28T00:00:00.000Z"],
              byId: {
                "2020-07-24T00:00:00.000Z": {
                  createdAt: "2020-07-24T00:00:00.000Z",
                  type: "v1/push-ups/create",
                  payload: { value: 10 },
                },
                "2020-07-28T00:00:00.000Z": {
                  createdAt: "2020-07-28T00:00:00.000Z",
                  type: "v1/push-ups/create",
                  payload: { value: 20 },
                },
              },
            },
          };
        });

        it("works with 2 push-ups within the interval", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toBe(3);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-07-29T00:00:00.000Z"),
            ),
          ).toBe(3);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-28T00:00:00.000Z"),
              new Date("2020-07-30T00:00:00.000Z"),
            ),
          ).toBe(3);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              state,
              new Date("2020-07-27T00:00:00.000Z"),
              new Date("2020-08-02T00:00:00.000Z"),
            ),
          ).toBe(3);
        });

        it("works with 2 meditations and only one in the interval", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              stateB,
              new Date("2020-07-26T00:00:00.000Z"),
              new Date("2020-08-02T00:00:00.000Z"),
            ),
          ).toBe(20);
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              stateB,
              new Date("2020-07-23T00:00:00.000Z"),
              new Date("2020-07-24T00:00:00.000Z"),
            ),
          ).toBe(10);
        });

        it("works with 2 meditations and both outside the interval", () => {
          expect(
            eventsSlice.selectors.totalPushUpsInPeriod(
              stateB,
              new Date("2020-07-25T00:00:00.000Z"),
              new Date("2020-07-27T00:00:00.000Z"),
            ),
          ).toBe(0);
        });
      });
    });
  });
});
