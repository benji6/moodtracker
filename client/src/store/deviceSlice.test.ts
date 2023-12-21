import store from ".";
import deviceSlice from "./deviceSlice";

describe("deviceSlice", () => {
  test("initial state", () => {
    expect(store.getState().device).toEqual(deviceSlice.getInitialState());
  });

  test("setGeolocation", () => {
    store.dispatch(
      deviceSlice.actions.setGeolocation({
        accuracy: 1,
        latitude: 4,
        longitude: 5,
      }),
    );
    expect(store.getState().device).toEqual({
      geolocation: {
        accuracy: 1,
        latitude: 4,
        longitude: 5,
      },
    });
    store.dispatch(
      deviceSlice.actions.setGeolocation({
        accuracy: 1,
        altitude: 100,
        altitudeAccuracy: 10,
        latitude: 4,
        longitude: 5,
      }),
    );
    expect(store.getState().device).toEqual({
      geolocation: {
        accuracy: 1,
        altitude: 100,
        altitudeAccuracy: 10,
        latitude: 4,
        longitude: 5,
      },
    });
  });

  test("clear", () => {
    store.dispatch(
      deviceSlice.actions.setGeolocation({
        accuracy: 1,
        latitude: 4,
        longitude: 5,
      }),
    );
    store.dispatch(deviceSlice.actions.clear());
    expect(store.getState().device).toEqual(deviceSlice.getInitialState());
  });
});
