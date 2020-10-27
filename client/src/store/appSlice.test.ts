import store from ".";
import appSlice from "./appSlice";

describe("appSlice", () => {
  test("initial state", () => {
    expect(store.getState().app).toEqual({ isStorageLoading: true });
  });

  test("storageLoaded", () => {
    store.dispatch(appSlice.actions.storageLoaded());
    expect(store.getState().app).toEqual({ isStorageLoading: false });
  });
});
