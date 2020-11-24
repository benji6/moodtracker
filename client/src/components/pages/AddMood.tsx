import { useNavigate, RouteComponentProps } from "@reach/router";
import * as React from "react";
import { Button, Paper, RadioButton, requiredValidator, TextField } from "eri";
import useRedirectUnauthed from "../hooks/useRedirectUnauthed";
import { useDispatch } from "react-redux";
import eventsSlice from "../../store/eventsSlice";
import { noPunctuationValidator } from "../../validators";
import { Mood } from "../../types";

export default function AddMood(_: RouteComponentProps) {
  useRedirectUnauthed();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [moodError, setMoodError] = React.useState<string | undefined>();
  const [descriptionError, setDescriptionError] = React.useState<
    string | undefined
  >();

  return (
    <Paper.Group>
      <Paper>
        <h2>Add mood</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const moodValue: string = (e.target as HTMLFormElement).mood.value;
            const moodFieldError = requiredValidator(moodValue);
            if (moodFieldError) setMoodError(moodFieldError);

            const descriptionValue: string = (e.target as HTMLFormElement)
              .description.value;
            const descriptionFieldError = noPunctuationValidator(
              descriptionValue
            );
            if (descriptionFieldError)
              setDescriptionError(descriptionFieldError);

            if (descriptionFieldError || moodFieldError) return;

            const payload: Mood = { mood: Number(moodValue) };
            if (descriptionValue) payload.description = descriptionValue.trim();

            dispatch(
              eventsSlice.actions.add({
                type: "v1/moods/create",
                createdAt: new Date().toISOString(),
                payload,
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
          <TextField
            autoComplete="on"
            error={descriptionError}
            label="Description (optional)"
            maxLength={32}
            name="description"
            required={false}
            supportiveText="Try to describe how you feel using a short (32 characters) list of words separated by spaces."
          />
          <Button.Group>
            <Button>Submit</Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
