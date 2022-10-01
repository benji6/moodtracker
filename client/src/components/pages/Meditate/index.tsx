import { Button, Paper, TextField } from "eri";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  ERRORS,
  MEDITATION_SEARCH_PARAM_TIME_KEY,
  TEST_IDS,
  TIME,
} from "../../../constants";
import "./style.css";

const MAX_MINUTES = 180;
const MINUTES_INPUT_NAME = "minutes";
const TIMES = [1, 2, 3, 5, 10, 15, 20, 30, 40];

export default function Meditate() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const navigateToTimer = (minutes: number): void =>
    void navigate(
      `/meditation/timer?${MEDITATION_SEARCH_PARAM_TIME_KEY}=${
        minutes * TIME.secondsPerMinute
      }`
    );

  return (
    <Paper.Group data-test-id={TEST_IDS.meditatePage}>
      <Paper>
        <h2>Meditate</h2>
        <p>
          This is a place where you can meditate. Select a preset time, enter a
          custom time or meditate freely with no fixed time. Once your
          meditation is finished you will have the opportunity to record it if
          you choose.
        </p>
        <p>
          Record your mood before and after to see how meditation changes things
          for you.
        </p>
      </Paper>
      <Paper>
        <h3>Presets</h3>
        <div className="m-meditate__preset_group">
          {TIMES.map((minutes) => (
            <Button
              data-minutes={minutes}
              data-test-id={TEST_IDS.meditationPresetTimeButton}
              key={minutes}
              onClick={() => navigateToTimer(minutes)}
              variant="secondary"
            >
              {minutes} min{minutes === 1 ? "" : "s"}
            </Button>
          ))}
        </div>
      </Paper>
      <Paper>
        <h3>Open-ended meditation</h3>
        <p>Meditate for however long you like</p>
        <Button.Group>
          <Button
            onClick={() => navigate("/meditation/open-ended")}
            type="button"
          >
            Start
          </Button>
        </Button.Group>
      </Paper>
      <Paper>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { validity, value } = (e.target as any)[
              MINUTES_INPUT_NAME
            ] as HTMLInputElement;

            const requiredError = validity.valueMissing;
            const patternError = validity.patternMismatch;

            const minutes = Number(value);

            let errorMessage = "";
            if (requiredError) errorMessage = ERRORS.required;
            else if (patternError) errorMessage = ERRORS.integer;
            else if (minutes > MAX_MINUTES)
              errorMessage = `The maximum allowed time is ${MAX_MINUTES} minutes`;

            if (!errorMessage) navigateToTimer(minutes);

            setError(errorMessage);
          }}
        >
          <h3>Custom time</h3>
          <p>Set a custom time for your meditation here</p>
          <TextField
            data-test-id={TEST_IDS.meditationCustomTimeInput}
            inputMode="numeric"
            error={error}
            label="Minutes"
            maxLength={3}
            pattern="[0-9]*"
            name={MINUTES_INPUT_NAME}
          />
          <Button.Group>
            <Button>Start</Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
