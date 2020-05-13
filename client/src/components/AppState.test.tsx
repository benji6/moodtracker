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
        type: "moods/create",
        payload: { mood: 4 },
      },
      "2020-05-07T19:39:00.000Z": {
        createdAt: "2020-05-07T19:39:00.000Z",
        type: "moods/create",
        payload: { mood: 9 },
      },
      "2020-05-07T20:31:00.000Z": {
        createdAt: "2020-05-07T20:31:00.000Z",
        type: "moods/delete",
        payload: "2020-05-07T19:36:00.000Z",
      },
      "2020-05-07T20:32:00.000Z": {
        createdAt: "2020-05-07T20:32:00.000Z",
        type: "moods/create",
        payload: { mood: 10 },
      },
      "2020-05-07T20:33:00.000Z": {
        createdAt: "2020-05-07T20:33:00.000Z",
        type: "moods/update",
        payload: { id: "2020-05-07T20:32:00.000Z", mood: 7 },
      },
    },
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
  describe("events/add", () => {
    test("when there are no events in state", () => {
      expect(
        appStateReducer(createInitialState(), {
          type: "events/add",
          payload: {
            createdAt: "2020-05-07T19:53:00.000Z",
            type: "moods/create",
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
              type: "moods/create",
              payload: { mood: 7 },
            },
          },
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
      test("moods/create", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "moods/delete",
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
                type: "moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
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

      test("moods/update", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "moods/update",
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
                type: "moods/update",
                payload: { id: "2020-05-07T20:32:00.000Z", mood: 5 },
              },
            },
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
              "2020-05-07T20:32:00.000Z": { mood: 5 },
            },
          },
        });
      });
    });

    // This could happen due to clock skew on an event that has come from the server
    describe("when there is an event in state that is newer than the created event", () => {
      test("moods/create", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "moods/create",
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
                type: "moods/create",
                payload: { mood: 4 },
              },
            },
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

      test("moods/delete", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "moods/delete",
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
                type: "moods/delete",
                payload: "2020-05-07T19:39:00.000Z",
              },
            },
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

      test("moods/update", () => {
        const stateWithEvents = createStateWithEvents();
        expect(
          appStateReducer(stateWithEvents, {
            type: "events/add",
            payload: {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "moods/update",
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
                type: "moods/update",
                payload: { id: "2020-05-07T20:32:00.000Z", mood: 2 },
              },
            },
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
              "2020-05-07T20:32:00.000Z": { mood: 2 },
            },
          },
        });
      });
    });
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
          "2020-05-07T20:32:00.000Z": { mood: 7 },
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
              type: "moods/create",
              payload: { mood: 7 },
            },
            {
              createdAt: "2020-05-07T19:55:00.000Z",
              type: "moods/delete",
              payload: "2020-05-07T19:53:00.000Z",
            },
            {
              createdAt: "2020-05-07T19:56:00.000Z",
              type: "moods/create",
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
              type: "moods/create",
              payload: { mood: 7 },
            },
            "2020-05-07T19:55:00.000Z": {
              createdAt: "2020-05-07T19:55:00.000Z",
              type: "moods/delete",
              payload: "2020-05-07T19:53:00.000Z",
            },
            "2020-05-07T19:56:00.000Z": {
              createdAt: "2020-05-07T19:56:00.000Z",
              type: "moods/create",
              payload: { mood: 8 },
            },
          },
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
              type: "moods/delete",
            },
            {
              createdAt: "2020-05-07T19:53:00.000Z",
              payload: { mood: 7 },
              type: "moods/create",
            },
            {
              createdAt: "2020-05-07T19:55:00.000Z",
              payload: "2020-05-07T19:53:00.000Z",
              type: "moods/delete",
            },
            {
              createdAt: "2020-05-07T19:56:00.000Z",
              payload: { mood: 8 },
              type: "moods/create",
            },
            {
              createdAt: "2020-05-07T20:30:00.000Z",
              payload: "2020-05-07T19:39:00.000Z",
              type: "moods/delete",
            },
            {
              createdAt: "2020-05-07T20:33:00.000Z",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 3 },
              type: "moods/update",
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
              type: "moods/create",
              payload: { mood: 7 },
            },
            "2020-05-07T19:55:00.000Z": {
              createdAt: "2020-05-07T19:55:00.000Z",
              type: "moods/delete",
              payload: "2020-05-07T19:53:00.000Z",
            },
            "2020-05-07T19:56:00.000Z": {
              createdAt: "2020-05-07T19:56:00.000Z",
              type: "moods/create",
              payload: { mood: 8 },
            },
            "2020-05-07T20:30:00.000Z": {
              createdAt: "2020-05-07T20:30:00.000Z",
              type: "moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            },
            "2020-05-07T20:33:00.000Z": {
              createdAt: "2020-05-07T20:33:00.000Z",
              type: "moods/update",
              payload: { id: "2020-05-07T20:32:00.000Z", mood: 3 },
            },
          },
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
            "2020-05-07T20:32:00.000Z": { mood: 3 },
          },
        },
      });
    });
  });

  test("storage/loaded", () => {
    expect(
      appStateReducer(
        { ...createInitialState(), isStorageLoading: true },
        { type: "storage/loaded" }
      )
    ).toEqual({ ...createInitialState(), isStorageLoading: false });
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
      ...createInitialState(),
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
      events: { ...initialState.events, nextCursor: "test-cursor-456" },
      isSyncingFromServer: false,
      syncFromServerError: false,
    });
  });

  test("user/clearEmail", () => {
    expect(
      appStateReducer(
        { ...createInitialState(), userEmail: "foo@bar.com" },
        { type: "user/clearEmail" }
      )
    ).toEqual(createInitialState());
  });

  test("user/setEmail", () => {
    expect(
      appStateReducer(createInitialState(), {
        type: "user/setEmail",
        payload: "foo@bar.com",
      })
    ).toEqual({ ...createInitialState(), userEmail: "foo@bar.com" });
  });
});
