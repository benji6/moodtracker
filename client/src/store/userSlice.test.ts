import store from ".";
import userSlice from "./userSlice";

describe("userSlice", () => {
  test("initial state", () => {
    expect(store.getState().user).toEqual({
      email: undefined,
      id: undefined,
      loading: true,
    });
  });

  test("set", () => {
    store.dispatch(
      userSlice.actions.set({ email: "test@test.com", id: "foo" })
    );
    expect(store.getState().user).toEqual({
      email: "test@test.com",
      id: "foo",
      loading: false,
    });
  });

  test("clear", () => {
    store.dispatch(userSlice.actions.clear());
    expect(store.getState().user).toEqual({
      email: undefined,
      id: undefined,
      loading: false,
    });
  });
});
