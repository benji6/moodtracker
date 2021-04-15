import { Button, Paper } from "eri";
import * as React from "react";
import { TIME } from "../../../../../constants";
import Dimmer from "./Dimmer";
import { TimerState } from "..";
import "./style.css";

interface Props {
  dimmed: boolean;
  onDim(): void;
  onFinish(): void;
  onPause(): void;
  onPlay(): void;
  onReveal(): void;
  roundedSeconds: number;
  timerState: TimerState;
}

function MeditationTimerPresentation({
  dimmed,
  onDim,
  onFinish,
  onPause,
  onPlay,
  onReveal,
  roundedSeconds,
  timerState,
}: Props) {
  return (
    <>
      <Paper.Group>
        <Paper>
          <h2>Meditation timer</h2>
          <p className="m-meditation-timer__clock center">
            {`${String(
              Math.floor(roundedSeconds / TIME.secondsPerMinute)
            ).padStart(2, "0")}:${String(
              Math.floor(roundedSeconds % TIME.secondsPerMinute)
            ).padStart(2, "0")}`}
          </p>
          <Button.Group>
            <Button onClick={onFinish}>Finish</Button>
            <Button disabled={timerState === "FINISHED"} onClick={onDim}>
              Dim screen
            </Button>
            <Button
              disabled={timerState === "FINISHED"}
              onClick={() => {
                if (timerState === "PAUSED") return onPlay();
                onPause();
              }}
            >
              {timerState === "PAUSED" ? "Play" : "Pause"}
            </Button>
          </Button.Group>
        </Paper>
      </Paper.Group>
      <Dimmer enabled={dimmed} onClick={onReveal} />
    </>
  );
}

export default React.memo(MeditationTimerPresentation);
