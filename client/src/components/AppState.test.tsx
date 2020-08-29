import { appStateReducer, createInitialState, State } from "./AppState";

const createStateWithEvents = (): State => ({
  ...createInitialState(),
  events: {
    allIds: [
      "2020-05-07T19:36:00.000Z",
      "2020-05-07T19:39:00.000Z",
      "2020-05-07T20:31:00.000Z",
      "2020-05-07T20:32:00.000Z",
      "2020-05-07T20:33:00.000Z",
    ],
    byId: {
      "2020-05-07T19:36:00.000Z": {
        createdAt: "2020-05-07T19:36:00.000Z",
        type: "v1/moods/create",
        payload: { mood: 4 },
      },
      "2020-05-07T19:39:00.000Z": {
        createdAt: "2020-05-07T19:39:00.000Z",
        type: "v1/moods/create",
        payload: { mood: 9 },
      },
      "2020-05-07T20:31:00.000Z": {
        createdAt: "2020-05-07T20:31:00.000Z",
        type: "v1/moods/delete",
        payload: "2020-05-07T19:36:00.000Z",
      },
      "2020-05-07T20:32:00.000Z": {
        createdAt: "2020-05-07T20:32:00.000Z",
        type: "v1/moods/create",
        payload: { mood: 10 },
      },
      "2020-05-07T20:33:00.000Z": {
        createdAt: "2020-05-07T20:33:00.000Z",
        type: "v1/moods/update",
        payload: { id: "2020-05-07T20:32:00.000Z", mood: 7 },
      },
    },
    hasLoadedFromServer: true,
    idsToSync: [
      "2020-05-07T20:31:00.000Z",
      "2020-05-07T20:32:00.000Z",
      "2020-05-07T20:33:00.000Z",
    ],
    nextCursor: "test-cursor-123",
  },
  moods: {
    allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:32:00.000Z"],
    byId: {
      "2020-05-07T19:39:00.000Z": { mood: 9 },
      "2020-05-07T20:32:00.000Z": { mood: 7 },
    },
  },
});

describe("appStateReducer", () => {
  test("app/storageLoaded", () => {
    expect(
      appStateReducer(
        { ...createInitialState(), isStorageLoading: true },
        { type: "app/storageLoaded" }
      )
    ).toEqual({ ...createInitialState(), isStorageLoading: false });
  });

  describe("events/add", () => {
    test("when there are no events in state", () => {
      expect(
        appStateReducer(createInitialState(), {
          type: "events/add",
          payload: {
            createdAt: "2020-05-07T19:53:00.000Z",
            type: "v1/moods/create",
            payload: { mood: 7 },
          },
        })
      ).toEqual({
        ...createInitialState(),
        events: {
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
        },
        moods: {
          allIds: ["2020-05-07T19:53:00.000Z"],
          byId: {
            "2020-05-07T19:53:00.000Z": { mood: 7 },
          },
        },
      });
    });

    describe("when there are events in state", () => {
      test("v1/moods/create", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            },
          })
        ).toEqual({
          ...createInitialState(),
          events: {
            allIds: [
              "2020-05-07T19:36:00.000Z",
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:34:00.000Z",
            ],
            byId: {
              ...stateWithEvents.events.byId,
              "2020-05-07T20:34:00.000Z": {
                createdAt: "2020-05-07T20:34:00.000Z",
                type: "v1/moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
            hasLoadedFromServer: true,
            idsToSync: [
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:34:00.000Z",
            ],
            nextCursor: "test-cursor-123",
          },
          moods: {
            allIds: ["2020-05-07T20:32:00.000Z"],
            byId: {
              "2020-05-07T20:32:00.000Z": { mood: 7 },
            },
          },
        });
      });

      test("v1/moods/update", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "v1/moods/update",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 5 },
            },
          })
        ).toEqual({
          ...createInitialState(),
          events: {
            allIds: [
              "2020-05-07T19:36:00.000Z",
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:34:00.000Z",
            ],
            byId: {
              ...stateWithEvents.events.byId,
              "2020-05-07T20:34:00.000Z": {
                createdAt: "2020-05-07T20:34:00.000Z",
                type: "v1/moods/update",
                payload: { id: "2020-05-07T20:32:00.000Z", mood: 5 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: [
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:34:00.000Z",
            ],
            nextCursor: "test-cursor-123",
          },
          moods: {
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:32:00.000Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": { mood: 9 },
              "2020-05-07T20:32:00.000Z": {
                mood: 5,
                updatedAt: "2020-05-07T20:34:00.000Z",
              },
            },
          },
        });
      });
    });

    // This could happen due to clock skew on an event that has come from the server
    describe("when there is an event in state that is newer than the created event", () => {
      test("v1/moods/create", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 4 },
            },
          })
        ).toEqual({
          ...createInitialState(),
          events: {
            allIds: [
              "2020-05-07T19:36:00.000Z",
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            byId: {
              ...stateWithEvents.events.byId,
              "2020-05-07T20:33:00.001Z": {
                createdAt: "2020-05-07T20:33:00.001Z",
                type: "v1/moods/create",
                payload: { mood: 4 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: [
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            nextCursor: "test-cursor-123",
          },
          moods: {
            allIds: [
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            byId: {
              "2020-05-07T19:39:00.000Z": { mood: 9 },
              "2020-05-07T20:32:00.000Z": { mood: 7 },
              "2020-05-07T20:33:00.001Z": { mood: 4 },
            },
          },
        });
      });

      test("v1/moods/delete", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            },
          })
        ).toEqual({
          ...createInitialState(),
          events: {
            allIds: [
              "2020-05-07T19:36:00.000Z",
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            byId: {
              ...stateWithEvents.events.byId,
              "2020-05-07T20:33:00.001Z": {
                createdAt: "2020-05-07T20:33:00.001Z",
                type: "v1/moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
            hasLoadedFromServer: true,
            idsToSync: [
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            nextCursor: "test-cursor-123",
          },
          moods: {
            allIds: ["2020-05-07T20:32:00.000Z"],
            byId: { "2020-05-07T20:32:00.000Z": { mood: 7 } },
          },
        });
      });

      test("v1/moods/update", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "v1/moods/update",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 2 },
            },
          })
        ).toEqual({
          ...createInitialState(),
          events: {
            allIds: [
              "2020-05-07T19:36:00.000Z",
              "2020-05-07T19:39:00.000Z",
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            byId: {
              ...stateWithEvents.events.byId,
              "2020-05-07T20:33:00.001Z": {
                createdAt: "2020-05-07T20:33:00.001Z",
                type: "v1/moods/update",
                payload: { id: "2020-05-07T20:32:00.000Z", mood: 2 },
              },
            },
            hasLoadedFromServer: true,
            idsToSync: [
              "2020-05-07T20:31:00.000Z",
              "2020-05-07T20:32:00.000Z",
              "2020-05-07T20:33:00.000Z",
              "2020-05-07T20:33:00.001Z",
            ],
            nextCursor: "test-cursor-123",
          },
          moods: {
            allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:32:00.000Z"],
            byId: {
              "2020-05-07T19:39:00.000Z": { mood: 9 },
              "2020-05-07T20:32:00.000Z": {
                mood: 2,
                updatedAt: "2020-05-07T20:33:00.001Z",
              },
            },
          },
        });
      });
    });
  });

  test("events/deleteAll", () => {
    expect(
      appStateReducer(createStateWithEvents(), {
        type: "events/deleteAll",
      })
    ).toEqual(createInitialState());
  });

  test("events/loadFromStorage", () => {
    const events = createStateWithEvents()["events"];
    expect(
      appStateReducer(
        { ...createInitialState(), isStorageLoading: true },
        {
          type: "events/loadFromStorage",
          payload: events,
        }
      )
    ).toEqual({
      ...createInitialState(),
      events: events,
      moods: {
        allIds: ["2020-05-07T19:39:00.000Z", "2020-05-07T20:32:00.000Z"],
        byId: {
          "2020-05-07T19:39:00.000Z": { mood: 9 },
          "2020-05-07T20:32:00.000Z": {
            mood: 7,
            updatedAt: "2020-05-07T20:33:00.000Z",
          },
        },
      },
    });
  });

  describe("events/syncFromServer", () => {
    test("when there are no events in state and no server events", () => {
      expect(
        appStateReducer(createInitialState(), {
          type: "events/syncFromServer",
          payload: [],
        })
      ).toEqual(createInitialState());
    });

    test("when there are events in state and no server events", () => {
      expect(
        appStateReducer(createStateWithEvents(), {
          type: "events/syncFromServer",
          payload: [],
        })
      ).toEqual(createStateWithEvents());
    });

    test("when there are no events in state and some server events", () => {
      expect(
        appStateReducer(createInitialState(), {
          type: "events/syncFromServer",
          payload: [
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
        })
      ).toEqual({
        ...createInitialState(),
        events: {
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
          hasLoadedFromServer: false,
          idsToSync: [],
        },
        moods: {
          allIds: ["2020-05-07T19:56:00.000Z"],
          byId: {
            "2020-05-07T19:56:00.000Z": { mood: 8 },
          },
        },
      });
    });

    test("when there are events in state and some server events", () => {
      const stateWithEvents = createStateWithEvents();
      expect(
        appStateReducer(stateWithEvents, {
          type: "events/syncFromServer",
          payload: [
            {
              createdAt: "2020-05-07T20:31:00.000Z",
              payload: "2020-05-07T19:36:00.000Z",
              type: "v1/moods/delete",
            },
            {
              createdAt: "2020-05-07T19:53:00.000Z",
              payload: { mood: 7 },
              type: "v1/moods/create",
            },
            {
              createdAt: "2020-05-07T19:55:00.000Z",
              payload: "2020-05-07T19:53:00.000Z",
              type: "v1/moods/delete",
            },
            {
              createdAt: "2020-05-07T19:56:00.000Z",
              payload: { mood: 8 },
              type: "v1/moods/create",
            },
            {
              createdAt: "2020-05-07T20:30:00.000Z",
              payload: "2020-05-07T19:39:00.000Z",
              type: "v1/moods/delete",
            },
            {
              createdAt: "2020-05-07T20:33:00.000Z",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 3 },
              type: "v1/moods/update",
            },
          ],
        })
      ).toEqual({
        ...createInitialState(),
        events: {
          allIds: [
            "2020-05-07T19:36:00.000Z",
            "2020-05-07T19:39:00.000Z",
            "2020-05-07T19:53:00.000Z",
            "2020-05-07T19:55:00.000Z",
            "2020-05-07T19:56:00.000Z",
            "2020-05-07T20:30:00.000Z",
            "2020-05-07T20:31:00.000Z",
            "2020-05-07T20:32:00.000Z",
            "2020-05-07T20:33:00.000Z",
          ],
          byId: {
            ...stateWithEvents.events.byId,
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
            "2020-05-07T20:30:00.000Z": {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            },
            "2020-05-07T20:33:00.000Z": {
              createdAt: "2020-05-07T20:33:00.000Z",
              type: "v1/moods/update",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 3 },
            },
          },
          hasLoadedFromServer: true,
          idsToSync: [
            "2020-05-07T20:31:00.000Z",
            "2020-05-07T20:32:00.000Z",
            "2020-05-07T20:33:00.000Z",
          ],
          nextCursor: "test-cursor-123",
        },
        moods: {
          allIds: ["2020-05-07T19:56:00.000Z", "2020-05-07T20:32:00.000Z"],
          byId: {
            "2020-05-07T19:56:00.000Z": { mood: 8 },
            "2020-05-07T20:32:00.000Z": {
              mood: 3,
              updatedAt: "2020-05-07T20:33:00.000Z",
            },
          },
        },
      });
    });
  });

  test("syncToServer/error", () => {
    const stateWithEvents = createStateWithEvents();
    expect(
      appStateReducer(
        {
          ...stateWithEvents,
          isSyncingToServer: true,
          syncToServerError: false,
        },
        { type: "syncToServer/error" }
      )
    ).toEqual({
      ...stateWithEvents,
      isSyncingToServer: false,
      syncToServerError: true,
    });
  });

  test("syncToServer/start", () => {
    const stateWithEvents = createStateWithEvents();
    expect(
      appStateReducer(
        {
          ...stateWithEvents,
          isSyncingToServer: false,
          syncToServerError: true,
        },
        { type: "syncToServer/start" }
      )
    ).toEqual({
      ...stateWithEvents,
      isSyncingToServer: true,
      syncToServerError: false,
    });
  });

  test("syncToServer/success", () => {
    const stateWithEvents = createStateWithEvents();
    expect(
      appStateReducer(
        {
          ...stateWithEvents,
          isSyncingToServer: true,
          syncToServerError: true,
        },
        { type: "syncToServer/success" }
      )
    ).toEqual({
      ...stateWithEvents,
      events: { ...stateWithEvents.events, idsToSync: [] },
      isSyncingToServer: false,
      syncToServerError: false,
    });
  });

  test("syncFromServer/error", () => {
    const initialState = createInitialState();
    expect(
      appStateReducer(
        {
          ...createInitialState(),
          isSyncingFromServer: true,
          syncFromServerError: false,
        },
        { type: "syncFromServer/error" }
      )
    ).toEqual({
      ...initialState,
      events: { ...initialState.events, hasLoadedFromServer: true },
      isSyncingFromServer: false,
      syncFromServerError: true,
    });
  });

  test("syncFromServer/start", () => {
    expect(
      appStateReducer(
        {
          ...createInitialState(),
          isSyncingFromServer: false,
          syncFromServerError: true,
        },
        { type: "syncFromServer/start" }
      )
    ).toEqual({
      ...createInitialState(),
      isSyncingFromServer: true,
      syncFromServerError: false,
    });
  });

  test("syncFromServer/success", () => {
    const initialState = createInitialState();
    expect(
      appStateReducer(
        {
          ...createInitialState(),
          isSyncingFromServer: true,
          syncFromServerError: true,
        },
        { type: "syncFromServer/success", payload: "test-cursor-456" }
      )
    ).toEqual({
      ...initialState,
      events: {
        ...initialState.events,
        hasLoadedFromServer: true,
        nextCursor: "test-cursor-456",
      },
      isSyncingFromServer: false,
      syncFromServerError: false,
    });
  });

  test("user/clear", () => {
    expect(
      appStateReducer(
        {
          ...createInitialState(),
          user: { email: "foo@bar.com", id: "fake-id", loading: true },
        },
        { type: "user/clear" }
      )
    ).toEqual({
      ...createInitialState(),
      user: { email: undefined, id: undefined, loading: false },
    });
  });

  test("user/set", () => {
    expect(
      appStateReducer(createInitialState(), {
        type: "user/set",
        payload: { email: "foo@bar.com", id: "fake-id" },
      })
    ).toEqual({
      ...createInitialState(),
      user: { email: "foo@bar.com", id: "fake-id", loading: false },
    });
  });
});
