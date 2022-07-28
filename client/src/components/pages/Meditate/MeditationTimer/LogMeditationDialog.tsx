import { Button, Dialog } from "eri";
import * as React from "react";
import { TIME } from "../../../../constants";
import formatDurationFromSeconds from "../../../../formatters/formatDurationFromSeconds";

interface Props {
  onClose(): void;
  onDontLog(): void;
  onLog(): void;
  open: boolean;
  secondsMeditated: number;
  timerDurationInSeconds: number;
}

function LogMeditationDialog({
  onClose,
  onDontLog,
  onLog,
  open,
  secondsMeditated,
  timerDurationInSeconds,
}: Props) {
  return (
    <Dialog onClose={onClose} open={open} title="Log this meditation?">
      <p>
        You haven&apos;t finished the full{" "}
        <b>{timerDurationInSeconds / TIME.secondsPerMinute}</b> minute timed
        meditation.
      </p>
      <p>
        Would you like to log{" "}
        <b>{formatDurationFromSeconds(secondsMeditated)}</b>?
      </p>
      <Button.Group>
        <Button onClick={onLog}>Log</Button>
        <Button onClick={onDontLog} variant="secondary">
          Don&apos;t log
        </Button>
        <Button onClick={onClose} variant="secondary">
          Resume meditation
        </Button>
      </Button.Group>
    </Dialog>
  );
}

export default React.memo(LogMeditationDialog);
