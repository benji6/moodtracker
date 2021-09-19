import store, { RootState } from ".";
import {
  settingsDataSelector,
  settingsIsSyncingFromServerSelector,
  settingsIsSyncingToServerSelector,
  settingsShouldSyncToServerSelector,
} from "../selectors";
import { Settings } from "../types";
import settingsSlice, { createInitialState } from "./settingsSlice";

const createFakeSettingsData = (): Settings => ({
  recordLocation: true,
  updatedAt: "2021-09-19T00:00:00.000Z",
});

describe("settingsSlice", () => {
  let initialState: RootState["settings"];

  beforeEach(() => {
    initialState = createInitialState();
  });

  test("initial state", () => {
    expect(store.getState().settings).toEqual(initialState);
  });

  describe("actions", () => {
    beforeEach(() => {
      store.dispatch(settingsSlice.actions.clear());
    });

    test("clear", () => {
      store.dispatch(
        settingsSlice.actions.loadFromStorage(createFakeSettingsData())
      );
      expect(settingsDataSelector(store.getState())).toEqual(
        createFakeSettingsData()
      );
      store.dispatch(settingsSlice.actions.clear());
      expect(settingsDataSelector(store.getState())).toBeUndefined();
    });

    test("loadFromStorage", () => {
      store.dispatch(
        settingsSlice.actions.loadFromStorage(createFakeSettingsData())
      );
      expect(settingsDataSelector(store.getState())).toEqual(
        createFakeSettingsData()
      );
    });

    test("syncFromServerStart", () => {
      expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(false);
      store.dispatch(settingsSlice.actions.syncFromServerStart());
      expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(true);
    });

    test("syncFromServerError", () => {
      store.dispatch(settingsSlice.actions.syncFromServerStart());
      expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(true);
      store.dispatch(settingsSlice.actions.syncFromServerError());
      expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(false);
    });

    describe("syncFromServerSuccess", () => {
      test("when there is no data on the server or locally", () => {
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(settingsSlice.actions.syncFromServerSuccess());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(
          false
        );
      });

      test("when there is no data on the server, but there is locally", () => {
        store.dispatch(
          settingsSlice.actions.loadFromStorage(createFakeSettingsData())
        );
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(settingsSlice.actions.syncFromServerSuccess());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(true);
      });

      test("when there is data on the server, but not locally", () => {
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(
          settingsSlice.actions.syncFromServerSuccess(createFakeSettingsData())
        );
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsDataSelector(store.getState())).toEqual(
          createFakeSettingsData()
        );
      });

      test("when there is data on the server and the same data locally", () => {
        store.dispatch(
          settingsSlice.actions.loadFromStorage(createFakeSettingsData())
        );
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(
          settingsSlice.actions.syncFromServerSuccess(createFakeSettingsData())
        );
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsDataSelector(store.getState())).toEqual(
          createFakeSettingsData()
        );
      });

      test("when there is data on the server and more recent data locally", () => {
        store.dispatch(
          settingsSlice.actions.loadFromStorage({
            ...createFakeSettingsData(),
            updatedAt: "2021-10-19T00:00:00.000Z",
          })
        );
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(
          settingsSlice.actions.syncFromServerSuccess(createFakeSettingsData())
        );
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(true);
        expect(settingsDataSelector(store.getState())).toEqual({
          ...createFakeSettingsData(),
          updatedAt: "2021-10-19T00:00:00.000Z",
        });
      });

      test("when there is data on the server and stale data locally", () => {
        store.dispatch(
          settingsSlice.actions.loadFromStorage(createFakeSettingsData())
        );
        store.dispatch(settingsSlice.actions.syncFromServerStart());
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          true
        );
        store.dispatch(
          settingsSlice.actions.syncFromServerSuccess({
            ...createFakeSettingsData(),
            updatedAt: "2021-10-19T00:00:00.000Z",
          })
        );
        expect(settingsIsSyncingFromServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsShouldSyncToServerSelector(store.getState())).toBe(
          false
        );
        expect(settingsDataSelector(store.getState())).toEqual({
          ...createFakeSettingsData(),
          updatedAt: "2021-10-19T00:00:00.000Z",
        });
      });
    });

    test("syncToServerStart", () => {
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(false);
      store.dispatch(settingsSlice.actions.syncToServerStart());
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(true);
    });

    test("syncToServerError", () => {
      store.dispatch(settingsSlice.actions.syncToServerStart());
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(true);
      store.dispatch(settingsSlice.actions.syncToServerError());
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(false);
    });

    test("syncToServerSuccess", () => {
      store.dispatch(settingsSlice.actions.syncToServerStart());
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(true);
      expect(settingsShouldSyncToServerSelector(store.getState())).toBe(false);
      store.dispatch(settingsSlice.actions.syncToServerSuccess());
      expect(settingsIsSyncingToServerSelector(store.getState())).toBe(false);
      expect(settingsShouldSyncToServerSelector(store.getState())).toBe(false);
    });
  });
});
