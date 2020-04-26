import { RouteComponentProps, NavigateFn } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton, requiredValidator } from "eri";
import { DispatchContext } from "../AppState";

export default function AddMood({ navigate }: RouteComponentProps) {
  const dispatch = React.useContext(DispatchContext);
  const [moodError, setMoodError] = React.useState<string | undefined>();

  return (
    <Paper.Group>
      <Paper>
        <h2>Add mood</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const moodValue: string = (e.target as HTMLFormElement).mood.value;
            const fieldError = requiredValidator(moodValue);
            if (fieldError) {
              setMoodError(fieldError);
              return;
            }
            dispatch({
              type: "moods/create",
              payload: {
                createdAt: new Date().toISOString(),
                mood: Number(moodValue),
              },
            });
            (navigate as NavigateFn)("/");
          }}
        >
          <RadioButton.Group
            error={moodError}
            label="Mood"
            onChange={() => {
              if (moodError) setMoodError(undefined);
            }}
          >
            <RadioButton name="mood" value="1">
              1
            </RadioButton>
            <RadioButton name="mood" value="2">
              2
            </RadioButton>
            <RadioButton name="mood" value="3">
              3
            </RadioButton>
            <RadioButton name="mood" value="4">
              4
            </RadioButton>
            <RadioButton name="mood" value="5">
              5
            </RadioButton>
          </RadioButton.Group>
          <Button>Submit</Button>
        </form>
      </Paper>
    </Paper.Group>
  );
}
