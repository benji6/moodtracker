import { initialState, reducer, State } from "./reducer";

const createState = (props?: Partial<State>): State => ({
  ...initialState,
  ...props,
});

describe("MeditationTimer reducer", () => {
  test("isDialogOpen/set", () => {
    expect(
      reducer(createState({ isDialogOpen: true }), {
        payload: false,
        type: "isDialogOpen/set",
      })
    ).toEqual(createState({ isDialogOpen: false }));
    expect(
      reducer(createState({ isDialogOpen: false }), {
        payload: true,
        type: "isDialogOpen/set",
      })
    ).toEqual(createState({ isDialogOpen: true }));
  });

  test("isDimmerEnabled/set", () => {
    expect(
      reducer(createState(), { payload: false, type: "isDimmerEnabled/set" })
    ).toEqual(createState({ isDimmerEnabled: false }));
    expect(
      reducer(createState(), { payload: true, type: "isDimmerEnabled/set" })
    ).toEqual(createState({ isDimmerEnabled: true }));
  });

  test("remainingTime/set", () => {
    expect(
      reducer(createState(), { payload: 123, type: "remainingTime/set" })
    ).toEqual(createState({ remainingTime: 123 }));
    expect(
      reducer(createState(), { payload: 456, type: "remainingTime/set" })
    ).toEqual(createState({ remainingTime: 456 }));
  });

  test("timeFinished/set", () => {
    const payload = new Date();
    expect(
      reducer(
        createState({
          isDimmerEnabled: true,
          remainingTime: 123,
          timeFinished: undefined,
          timerState: "TIMING",
        }),
        {
          payload,
          type: "timeFinished/set",
        }
      )
    ).toEqual(
      createState({
        isDimmerEnabled: false,
        remainingTime: 0,
        timeFinished: payload,
        timerState: "FINISHED",
      })
    );
  });

  test("timerState/set", () => {
    expect(
      reducer(createState({ timerState: "TIMING" }), {
        payload: "PAUSED",
        type: "timerState/set",
      })
    ).toEqual(createState({ timerState: "PAUSED" }));
  });
});
