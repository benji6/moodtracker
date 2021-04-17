import { Button, Icon, Paper } from "eri";
import * as React from "react";
import { TEST_IDS } from "../../../../../constants";
import Dimmer from "./Dimmer";
import { TimerState } from "..";
import MeditationTimerClock from "./MeditationTimerClock";

interface Props {
  dimmed: boolean;
  onDim(): void;
  onFinish(): void;
  onPause(): void;
  onPlay(): void;
  onReveal(): void;
  roundedSecondsRemaining: number;
  timerState: TimerState;
  totalSeconds: number;
}

function MeditationTimerPresentation({
  dimmed,
  onDim,
  onFinish,
  onPause,
  onPlay,
  onReveal,
  roundedSecondsRemaining,
  timerState,
  totalSeconds,
}: Props) {
  return (
    <>
      <Paper.Group data-test-id={TEST_IDS.meditationTimerPage}>
        <Paper>
          <h2>Meditation timer</h2>
          <MeditationTimerClock
            remainingSeconds={roundedSecondsRemaining}
            totalSeconds={totalSeconds}
          />
          <Button.Group>
            <Button onClick={onFinish}>Finish</Button>
            <Button
              disabled={timerState === "FINISHED"}
              onClick={onDim}
              variant="secondary"
            >
              Dim screen
              <Icon margin="left" name="moon" />
            </Button>
            <Button
              disabled={timerState === "FINISHED"}
              onClick={() => {
                if (timerState === "PAUSED") return onPlay();
                onPause();
              }}
              variant="secondary"
            >
              {timerState === "PAUSED" ? (
                <>
                  Play
                  <Icon margin="left" name="play" />
                </>
              ) : (
                <>
                  Pause
                  <Icon margin="left" name="pause" />
                </>
              )}
            </Button>
          </Button.Group>
        </Paper>
      </Paper.Group>
      <Dimmer enabled={dimmed} onClick={onReveal} />
    </>
  );
}

export default React.memo(MeditationTimerPresentation);
