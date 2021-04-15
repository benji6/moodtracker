import { useNavigate } from "@reach/router";
import * as React from "react";
import {
  Button,
  Paper,
  RadioButton,
  requiredValidator,
  TextArea,
  TextField,
} from "eri";
import { useDispatch } from "react-redux";
import eventsSlice from "../../store/eventsSlice";
import { Mood } from "../../types";
import {
  DESCRIPTION_MAX_LENGTH,
  ERRORS,
  PATTERNS,
  TEST_IDS,
} from "../../constants";
import useKeyboardSave from "../hooks/useKeyboardSave";

export default function AddMood() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [moodError, setMoodError] = React.useState<string | undefined>();
  const [descriptionError, setDescriptionError] = React.useState<
    string | undefined
  >();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    const descriptionValue: string = formEl.description.value;
    const explorationValue: string = formEl.exploration.value;
    const moodValue: string = formEl.mood.value;

    const moodFieldError = requiredValidator(moodValue);
    if (moodFieldError) setMoodError(moodFieldError);

    const descriptionFieldError = (formEl.description as HTMLInputElement)
      .validity.patternMismatch;
    setDescriptionError(descriptionFieldError ? ERRORS.specialCharacters : "");

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
  };

  useKeyboardSave(handleSubmit);

  return (
    <Paper.Group data-test-id={TEST_IDS.addMoodPage}>
      <Paper>
        <h2>Add mood</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
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
            data-test-id={TEST_IDS.descriptionInput}
            error={descriptionError}
            label="Description"
            maxLength={DESCRIPTION_MAX_LENGTH}
            name="description"
            optional
            pattern={PATTERNS.noPunctuation}
            supportiveText={`Try to describe how you feel using a short (${DESCRIPTION_MAX_LENGTH} characters) list of words separated by spaces.`}
          />
          <TextArea
            label="Exploration"
            name="exploration"
            optional
            rows={5}
            supportiveText="This is a space to explore how you're feeling, why you're feeling that way and what's going on in your life right now"
          />
          <Button.Group>
            <Button data-test-id={TEST_IDS.addMoodSubmitButton}>Submit</Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
