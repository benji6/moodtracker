import store, { RootState } from ".";
import { eventsSelector } from "../selectors";
import eventsSlice, { createInitialState } from "./eventsSlice";

describe("eventsSlice", () => {
  let initialState: RootState["events"];
  let stateWithEvents: RootState["events"];

  beforeEach(() => {
    initialState = createInitialState();

    stateWithEvents = {
      ...createInitialState(),
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
    expect(eventsSelector(store.getState())).toEqual(initialState);
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
          })
        );
        expect(eventsSelector(store.getState())).toEqual({
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
            })
          );
        });

        test("v1/moods/create", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T20:34:00.000Z",
              type: "v1/moods/delete",
              payload: "2020-05-07T19:39:00.000Z",
            })
          );
          expect(eventsSelector(store.getState())).toEqual({
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
            })
          );
          expect(eventsSelector(store.getState())).toEqual({
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
            })
          );
        });

        test("v1/moods/create", () => {
          store.dispatch(
            eventsSlice.actions.add({
              createdAt: "2020-05-07T19:38:00.000Z",
              type: "v1/moods/create",
              payload: { mood: 4 },
            })
          );
          expect(eventsSelector(store.getState())).toEqual({
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
            })
          );
          expect(eventsSelector(store.getState())).toEqual({
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
            })
          );
          expect(eventsSelector(store.getState())).toEqual({
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
      expect(eventsSelector(store.getState())).toEqual(stateWithEvents);
      store.dispatch(eventsSlice.actions.clear());
      expect(eventsSelector(store.getState())).toEqual(initialState);
    });

    test("loadFromStorage", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      expect(eventsSelector(store.getState())).toEqual(stateWithEvents);
    });

    // test("syncFromServer/start", () => {
    //   expect(
    //     appStateReducer(
    //       {
    //         ...createInitialState(),
    //         isSyncingFromServer: false,
    //         syncFromServerError: true,
    //       },
    //       { type: "syncFromServer/start" }
    //     )
    //   ).toEqual({
    //     ...createInitialState(),
    //     isSyncingFromServer: true,
    //     syncFromServerError: false,
    //   });
    // });

    test("syncFromServerStart", () => {
      const expectedState = {
        ...stateWithEvents,
        isSyncingFromServer: true,
        syncFromServerError: false,
      };
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      expect(eventsSelector(store.getState())).toEqual(expectedState);
      store.dispatch(eventsSlice.actions.syncFromServerError());
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      expect(eventsSelector(store.getState())).toEqual(expectedState);
    });

    test("syncFromServerError", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncFromServerStart());
      store.dispatch(eventsSlice.actions.syncFromServerError());
      expect(eventsSelector(store.getState())).toEqual({
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
          })
        );
        expect(eventsSelector(store.getState())).toEqual({
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
          })
        );
        expect(eventsSelector(store.getState())).toEqual({
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
          })
        );
        expect(eventsSelector(store.getState())).toEqual({
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
                createdAt: "2020-05-07T20:35:00.000Z",
                payload: { mood: 9 },
                type: "v1/moods/create",
              },
              {
                createdAt: "2020-05-07T19:45:00.000Z",
                payload: { mood: 8 },
                type: "v1/moods/create",
              },
              {
                createdAt: "2020-05-07T19:35:00.000Z",
                payload: { mood: 7 },
                type: "v1/moods/create",
              },
            ],
          })
        );
        expect(eventsSelector(store.getState())).toEqual({
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
      expect(eventsSelector(store.getState())).toEqual(expectedState);
      store.dispatch(eventsSlice.actions.syncToServerError());
      store.dispatch(eventsSlice.actions.syncToServerStart());
      expect(eventsSelector(store.getState())).toEqual(expectedState);
    });

    test("syncToServerError", () => {
      store.dispatch(eventsSlice.actions.loadFromStorage(stateWithEvents));
      store.dispatch(eventsSlice.actions.syncToServerStart());
      store.dispatch(eventsSlice.actions.syncToServerError());
      expect(eventsSelector(store.getState())).toEqual({
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
      expect(eventsSelector(store.getState())).toEqual({
        ...stateWithEvents,
        idsToSync: [],
        isSyncingToServer: false,
        syncToServerError: false,
      });
    });
  });
});
