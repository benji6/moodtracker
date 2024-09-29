import { ERRORS, FIELDS, TEST_IDS } from "../../../constants";
import { RadioButton, TextArea, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import { Mood } from "../../../types";
import { captureException } from "../../../sentry";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";
import { moodToColor } from "../../../utils";
import useDarkMode from "../../hooks/useDarkMode";

export default function AddMood() {
  const darkMode = useDarkMode();
  const dispatch = useDispatch();
  const [moodError, setMoodError] = useState<string | undefined>();
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  const currentHour = new Date().getHours();
  const timeOfDay =
    currentHour < 4
      ? "evening"
      : currentHour < 12
        ? "morning"
        : currentHour < 17
          ? "afternoon"
          : "evening";

  return (
    <AddEvent
      eventType="moods"
      ref={formRef}
      onSubmit={(): boolean => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return false;
        }

        const descriptionEl: HTMLInputElement = formEl[FIELDS.description.name];
        const descriptionValue = descriptionEl.value;
        const explorationValue: string = formEl[FIELDS.exploration.name].value;
        const moodValue: string = formEl[FIELDS.mood.name].value;

        if (!moodValue) setMoodError(ERRORS.required);

        const descriptionFieldError = descriptionEl.validity.patternMismatch;
        setDescriptionError(
          descriptionFieldError ? ERRORS.specialCharacters : "",
        );

        if (descriptionFieldError || !moodValue) return false;

        const payload: Mood = { mood: Number(moodValue) };
        if (descriptionValue) payload.description = descriptionValue.trim();
        if (explorationValue) payload.exploration = explorationValue.trim();
        if (geolocation) payload.location = geolocation;

        dispatch(
          eventsSlice.actions.add({
            type: "v1/moods/create",
            createdAt: new Date().toISOString(),
            payload,
          }),
        );
        return true;
      }}
      subheading={`How are you feeling this ${timeOfDay}?`}
    >
      <RadioButton.Group
        error={moodError}
        label={FIELDS.mood.label}
        onChange={() => {
          if (moodError) setMoodError(undefined);
        }}
      >
        {[...Array(11)].map((_, i) => (
          <RadioButton
            color={darkMode ? moodToColor(i) : undefined}
            data-test-id={TEST_IDS.addMoodRadioButton}
            key={i}
            name={FIELDS.mood.name}
            value={i}
          >
            {i}
          </RadioButton>
        ))}
      </RadioButton.Group>
      <TextField {...FIELDS.description} error={descriptionError} />
      <TextArea {...FIELDS.exploration} />
    </AddEvent>
  );
}
