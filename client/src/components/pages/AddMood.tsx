import { useNavigate, RouteComponentProps } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton, requiredValidator } from "eri";
import useRedirectUnauthed from "../hooks/useRedirectUnauthed";
import { useDispatch } from "react-redux";
import eventsSlice from "../../store/eventsSlice";

export default function AddMood(_: RouteComponentProps) {
  useRedirectUnauthed();
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
            dispatch(
              eventsSlice.actions.add({
                type: "v1/moods/create",
                createdAt: new Date().toISOString(),
                payload: { mood: Number(moodValue) },
              })
            );
            navigate("/");
          }}
        >
          <RadioButton.Group
            error={moodError}
            label="Mood"
            onChange={() => {
              if (moodError) setMoodError(undefined);
            }}
          >
            {[...Array(11)].map((_, i) => (
              <RadioButton key={i} name="mood" value={i}>
                {i}
              </RadioButton>
            ))}
          </RadioButton.Group>
          <Button.Group>
            <Button>Submit</Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
