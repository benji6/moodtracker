import { useNavigate } from "@reach/router";
import { Button, Paper, TextField } from "eri";
import * as React from "react";
import {
  ERRORS,
  MEDITATION_SEARCH_PARAM_TIME_KEY,
  TEST_IDS,
  TIME,
} from "../../../constants";
import MeditationLog from "./MeditationLog";
import MeditationStats from "./MeditationStats";
import "./style.css";

const MAX_MINUTES = 180;
const MINUTES_INPUT_NAME = "minutes";
const TIMES = [1, 2, 3, 5, 10, 15, 20, 30, 40];

export default function Meditate() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const navigateToTimer = (minutes: number): void =>
    void navigate(
      `/meditate/timer?${MEDITATION_SEARCH_PARAM_TIME_KEY}=${
        minutes * TIME.secondsPerMinute
      }`
    );

  return (
    <Paper.Group data-test-id={TEST_IDS.meditatePage}>
      <Paper>
        <h2>Meditate</h2>
        <p>
          This is a place where you can meditate. Select a preset time or enter
          a custom time and press start. Once your meditation is finished you
          will have the opportunity to record it if you choose.
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
      <MeditationStats />
      <MeditationLog />
    </Paper.Group>
  );
}
