import { Button, Icon, Paper } from "eri";
import { TEST_IDS } from "../../../../../../constants";
import Dimmer from "../../Dimmer";
import { TimerState } from "../reducer";
import MeditationTimerClock from "./MeditationTimerClock";
import { memo } from "react";

interface Props {
  dimmed: boolean;
  onDim(): void;
  onDontLog(): void;
  onFinish(): void;
  onLog(): void;
  onPause(): void;
  onPlay(): void;
  onUndim(): void;
  roundedSecondsRemaining: number;
  timerState: TimerState;
  totalSeconds: number;
}

function MeditationTimerPresentation({
  dimmed,
  onDim,
  onDontLog,
  onFinish,
  onLog,
  onPause,
  onPlay,
  onUndim,
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
              <Button onClick={onLog}>Log meditation</Button>
              <Button onClick={onDontLog} variant="secondary">
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
      <Dimmer enabled={dimmed} onUndim={onUndim} />
    </>
  );
}

export default memo(MeditationTimerPresentation);
