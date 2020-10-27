import { appStateReducer, createInitialState } from "./AppState";

describe("appStateReducer", () => {
  test("app/storageLoaded", () => {
    expect(
      appStateReducer(
        { ...createInitialState(), isStorageLoading: true },
        { type: "app/storageLoaded" }
      )
    ).toEqual({ ...createInitialState(), isStorageLoading: false });
  });
});
