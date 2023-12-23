import "./style.css";
import { Button, Icon, Paper } from "eri";
import Dimmer from "../../Dimmer";
import { formatSecondsAsTime } from "../../../../../../utils";
import { memo } from "react";

interface Props {
  dimmed: boolean;
  isPaused: boolean;
  onDim(): void;
  onFinishAndLog(): void;
  onPause(): void;
  onPlay(): void;
  onUndim(): void;
  roundedSeconds: number;
}

const OpenEndedMeditationPresentation = ({
  dimmed,
  isPaused,
  onDim,
  onFinishAndLog,
  onPause,
  onPlay,
  onUndim,
  roundedSeconds,
}: Props) => {
  return (
    <>
      <Paper.Group>
        <Paper>
          <h2>Open-ended meditation</h2>
          <p className="center m-open-ended-meditation__clock">
            {formatSecondsAsTime(roundedSeconds)}
          </p>
          <Button.Group>
            <Button onClick={onFinishAndLog}>Finish &amp; log</Button>
            <Button onClick={onDim} variant="secondary">
              Dim screen
              <Icon margin="start" name="moon" />
            </Button>
            <Button
              onClick={() => {
                if (isPaused) return onPlay();
                onPause();
              }}
              variant="secondary"
            >
              {isPaused ? (
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
        </Paper>
      </Paper.Group>
      <Dimmer enabled={dimmed} onUndim={onUndim} />
    </>
  );
};

export default memo(OpenEndedMeditationPresentation);
