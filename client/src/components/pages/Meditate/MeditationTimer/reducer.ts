import { FluxStandardAction } from "../../../../types";

export type TimerState = "FINISHED" | "PAUSED" | "TIMING";

type Action =
  | FluxStandardAction<"isDimmerEnabled/set", boolean>
  | FluxStandardAction<"remainingTime/set", number>
  | FluxStandardAction<"timeFinished/set", Date>
  | FluxStandardAction<"timerState/set", TimerState>;

export interface State {
  isDimmerEnabled: boolean;
  remainingTime: number | undefined;
  timeFinished: Date | undefined;
  timerState: TimerState;
}

export const initialState: State = {
  isDimmerEnabled: false,
  remainingTime: undefined,
  timeFinished: undefined,
  timerState: "TIMING",
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "isDimmerEnabled/set":
      return { ...state, isDimmerEnabled: action.payload };
    case "remainingTime/set":
      return { ...state, remainingTime: action.payload };
    case "timeFinished/set":
      return {
        isDimmerEnabled: false,
        remainingTime: 0,
        timeFinished: action.payload,
        timerState: "FINISHED",
      };
    case "timerState/set":
      return { ...state, timerState: action.payload };
  }
};
