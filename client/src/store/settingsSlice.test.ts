import store, { RootState } from ".";
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
        settingsSlice.actions.loadFromStorage(createFakeSettingsData()),
      );
      expect(settingsSlice.selectors.data(store.getState())).toEqual(
        createFakeSettingsData(),
      );
      store.dispatch(settingsSlice.actions.clear());
      expect(settingsSlice.selectors.data(store.getState())).toBeUndefined();
    });

    test("loadFromStorage", () => {
      store.dispatch(
        settingsSlice.actions.loadFromStorage(createFakeSettingsData()),
      );
      expect(settingsSlice.selectors.data(store.getState())).toEqual(
        createFakeSettingsData(),
      );
    });
  });
});
