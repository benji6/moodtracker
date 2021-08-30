import { Button, Icon, Paper } from "eri";
import * as React from "react";
import { TEST_IDS } from "../../../../../constants";
import Dimmer from "../../Dimmer";
import { TimerState } from "..";
import MeditationTimerClock from "./MeditationTimerClock";

interface Props {
  dimmed: boolean;
  onDim(): void;
  onFinish(): void;
  onFinishAndLog(): void;
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
  onFinishAndLog,
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
          {timerState === "FINISHED" ? (
            <Button.Group>
              <Button onClick={onFinishAndLog}>Log meditation</Button>
              <Button onClick={onFinish} variant="secondary">
                Finish
              </Button>
            </Button.Group>
          ) : (
            <Button.Group>
              <Button onClick={onFinish}>Finish</Button>
              <Button onClick={onDim} variant="secondary">
                Dim screen
                <Icon margin="start" name="moon" />
              </Button>
              <Button
                onClick={() => {
                  if (timerState === "PAUSED") return onPlay();
                  onPause();
                }}
                variant="secondary"
              >
                {timerState === "PAUSED" ? (
                  <>
                    Play
                    <Icon margin="start" name="play" />
                  </>
                ) : (
                  <>
                    Pause
                    <Icon margin="start" name="pause" />
                  </>
                )}
              </Button>
            </Button.Group>
          )}
        </Paper>
      </Paper.Group>
      <Dimmer enabled={dimmed} onClick={onReveal} />
    </>
  );
}

export default React.memo(MeditationTimerPresentation);
