import appSlice from "./appSlice";
import store from ".";

describe("appSlice", () => {
  afterEach(() => {
    store.dispatch(appSlice.actions.clear());
  });

  test("initial state", () => {
    expect(store.getState().app).toEqual({
      eventTypeTracking: {
        "leg-raises": true,
        meditations: true,
        moods: true,
        "push-ups": true,
        runs: true,
        "sit-ups": true,
        sleeps: true,
        weights: true,
      },
      isStorageLoading: true,
      showNewSignInUi: false,
    });
  });

  test("loadFromStorage", () => {
    store.dispatch(
      appSlice.actions.loadFromStorage(["meditations", "weights"]),
    );
    expect(store.getState().app).toEqual({
      eventTypeTracking: {
        "leg-raises": true,
        meditations: false,
        moods: true,
        "push-ups": true,
        runs: true,
        "sit-ups": true,
        sleeps: true,
        weights: false,
      },
      isStorageLoading: true,
      showNewSignInUi: false,
    });
  });

  test("toggleEventTrackingForEvent", () => {
    store.dispatch(appSlice.actions.toggleEventTrackingForEvent("meditations"));
    expect(store.getState().app).toEqual({
      isStorageLoading: true,
      eventTypeTracking: {
        "leg-raises": true,
        meditations: false,
        moods: true,
        "push-ups": true,
        runs: true,
        "sit-ups": true,
        sleeps: true,
        weights: true,
      },
      showNewSignInUi: false,
    });
    store.dispatch(appSlice.actions.toggleEventTrackingForEvent("meditations"));
    expect(store.getState().app).toEqual({
      isStorageLoading: true,
      eventTypeTracking: {
        "leg-raises": true,
        meditations: true,
        moods: true,
        "push-ups": true,
        runs: true,
        "sit-ups": true,
        sleeps: true,
        weights: true,
      },
      showNewSignInUi: false,
    });
  });

  test("storageLoaded", () => {
    expect(store.getState().app.isStorageLoading).toBe(true);
    store.dispatch(appSlice.actions.storageLoaded());
    expect(store.getState().app.isStorageLoading).toBe(false);
  });

  test("newSignIn", () => {
    store.dispatch(appSlice.actions.storageLoaded());
    expect(store.getState().app.isStorageLoading).toBe(false);
    expect(store.getState().app.showNewSignInUi).toBe(false);
    store.dispatch(appSlice.actions.newSignIn());
    expect(store.getState().app.showNewSignInUi).toBe(true);
    expect(store.getState().app.isStorageLoading).toBe(true);
  });

  test("dismissNewSignInUi", () => {
    store.dispatch(appSlice.actions.newSignIn());
    expect(store.getState().app.showNewSignInUi).toBe(true);
    store.dispatch(appSlice.actions.dismissNewSignInUi());
    expect(store.getState().app.showNewSignInUi).toBe(false);
  });
});
