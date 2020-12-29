import { useNavigate, RouteComponentProps } from "@reach/router";
import * as React from "react";
import {
  Button,
  Paper,
  RadioButton,
  requiredValidator,
  TextArea,
  TextField,
} from "eri";
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
            const formEl = e.target as HTMLFormElement;
            const descriptionValue: string = formEl.description.value;
            const explorationValue: string = formEl.exploration.value;
            const moodValue: string = formEl.mood.value;

            const moodFieldError = requiredValidator(moodValue);
            if (moodFieldError) setMoodError(moodFieldError);

            const descriptionFieldError = noPunctuationValidator(
              descriptionValue
            );

            if (descriptionFieldError)
              setDescriptionError(descriptionFieldError);

            if (descriptionFieldError || moodFieldError) return;

            const payload: Mood = { mood: Number(moodValue) };
            if (descriptionValue) payload.description = descriptionValue.trim();
            if (explorationValue) payload.exploration = explorationValue.trim();

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
            label="Description"
            maxLength={32}
            name="description"
            optional
            supportiveText="Try to describe how you feel using a short (32 characters max) list of words separated by spaces"
          />
          <TextArea
            label="Exploration"
            name="exploration"
            optional
            rows={5}
            supportiveText="This is a space to explore how you're feeling, why you're feeling that way and what's going on in your life right now"
          />
          <Button.Group>
            <Button>Submit</Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
