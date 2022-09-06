import store from ".";
import appSlice from "./appSlice";

describe("appSlice", () => {
  test("initial state", () => {
    expect(store.getState().app).toEqual({
      isStorageLoading: true,
      showNewSignInUi: false,
    });
  });

  test("storageLoaded", () => {
    store.dispatch(appSlice.actions.storageLoaded());
    expect(store.getState().app).toEqual({
      isStorageLoading: false,
      showNewSignInUi: false,
    });
  });

  test("newSignIn", () => {
    store.dispatch(appSlice.actions.newSignIn());
    expect(store.getState().app).toEqual({
      isStorageLoading: true,
      showNewSignInUi: true,
    });
  });

  test("dismissNewSignInUi", () => {
    store.dispatch(appSlice.actions.dismissNewSignInUi());
    expect(store.getState().app).toEqual({
      isStorageLoading: true,
      showNewSignInUi: false,
    });
  });
});
