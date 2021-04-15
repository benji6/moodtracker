import { useNavigate } from "@reach/router";
import { Button, Paper, TextField } from "eri";
import * as React from "react";
import { ERRORS, TIME } from "../../../constants";
import { SEARCH_PARAM_TIME_KEY } from "./constants";
import "./style.css";

const MINUTES_INPUT_NAME = "minutes";
const TIMES = [1, 2, 3, 5, 10, 15, 20, 30, 40];

export default function Meditate() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const navigateToTimer = (minutes: number): void =>
    void navigate(
      `/meditate/timer?${SEARCH_PARAM_TIME_KEY}=${
        minutes * TIME.secondsPerMinute
      }`
    );

  return (
    <Paper.Group>
      <Paper>
        <h2>Meditate</h2>
      </Paper>
      <Paper>
        <h3>Presets</h3>
        <div className="m-meditate__preset_group">
          {TIMES.map((minutes) => (
            <Button
              key={minutes}
              onClick={() => navigateToTimer(minutes)}
              variant="secondary"
            >
              {minutes} mins
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
            const errorMessage = requiredError
              ? ERRORS.required
              : patternError
              ? "Please type a valid number"
              : "";

            if (!errorMessage) navigateToTimer(Number(value));

            setError(errorMessage);
          }}
        >
          <h3>Custom time</h3>
          <TextField
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
