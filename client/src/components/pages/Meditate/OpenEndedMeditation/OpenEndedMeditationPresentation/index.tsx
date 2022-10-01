import { Button, Icon, Paper } from "eri";
import * as React from "react";
import { formatSecondsAsTime } from "../../../../../utils";
import Dimmer from "../../Dimmer";
import "./style.css";

interface Props {
  dimmed: boolean;
  isPaused: boolean;
  onDim(): void;
  onFinishAndLog(): void;
  onPause(): void;
  onPlay(): void;
  onReveal(): void;
  roundedSeconds: number;
}

const OpenEndedMeditationPresentation = ({
  dimmed,
  isPaused,
  onDim,
  onFinishAndLog,
  onPause,
  onPlay,
  onReveal,
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
      <Dimmer enabled={dimmed} onClick={onReveal} />
    </>
  );
};

export default React.memo(OpenEndedMeditationPresentation);
