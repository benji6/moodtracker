import { ERRORS, FIELDS } from "../../../constants";
import { RadioButton, TextArea, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { UpdateMood } from "../../../types";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { moodToColor } from "../../../utils";
import useDarkMode from "../../hooks/useDarkMode";
import { useParams } from "react-router-dom";
import { useMoodTagsEnabled } from "../../hooks/useMoodTagsEnabled";

export default function EditMood() {
  const moodTagsEnabled = useMoodTagsEnabled();
  const darkMode = useDarkMode();
  const dispatch = useDispatch();
  const { id } = useParams();
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const [descriptionError, setDescriptionError] = useState<
    string | undefined
  >();
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  if (!id) return <RedirectHome />;
  const mood = moods.byId[id];
  if (!mood) return <RedirectHome />;

  return (
    <EditEvent
      eventType="moods"
      id={id}
      location={mood.location}
      onSubmit={(): boolean => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return false;
        }
        if (!id) {
          captureException(Error("ID is undefined"));
          return false;
        }
        setShowNoUpdateError(false);

        const descriptionEl: HTMLInputElement | undefined =
          formEl[FIELDS.description.name];
        const descriptionValue = descriptionEl?.value;
        const explorationValue: string = formEl[FIELDS.exploration.name].value;
        const moodValue: string = formEl[FIELDS.mood.name].value;

        const descriptionFieldError = descriptionEl
          ? descriptionEl.validity.patternMismatch
          : false;
        setDescriptionError(
          descriptionFieldError ? ERRORS.specialCharacters : "",
        );

        const payload: UpdateMood = { id };
        let shouldUpdate = false;

        const moodValueNumber = Number(moodValue);
        if (moodValueNumber !== mood.mood) {
          payload.mood = moodValueNumber;
          shouldUpdate = true;
        }

        const trimmedDescriptionValue = descriptionValue?.trim();
        if (
          trimmedDescriptionValue !== undefined &&
          trimmedDescriptionValue !== mood.description
        ) {
          payload.description = trimmedDescriptionValue;
          shouldUpdate = true;
        }

        const trimmedExplorationValue = explorationValue.trim();
        if (trimmedExplorationValue !== mood.exploration) {
          payload.exploration = explorationValue.trim();
          shouldUpdate = true;
        }

        if (!shouldUpdate) {
          setShowNoUpdateError(true);
          return false;
        }

        dispatch(
          eventsSlice.actions.add({
            type: "v1/moods/update",
            createdAt: new Date().toISOString(),
            payload,
          }),
        );
        return true;
      }}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={mood.updatedAt}
    >
      <RadioButton.Group label={FIELDS.mood.label}>
        {[...Array(11)].map((_, i) => (
          <RadioButton
            color={darkMode ? moodToColor(i) : undefined}
            // There is old data where mood is a float between 0 and 10
            // We handle that by rounding for this input control
            defaultChecked={Math.round(mood.mood) === i}
            key={i}
            name={FIELDS.mood.name}
            value={i}
          >
            {i}
          </RadioButton>
        ))}
      </RadioButton.Group>
      {(moodTagsEnabled || mood.description) && (
        <TextField
          {...FIELDS.description}
          defaultValue={mood.description}
          error={descriptionError}
        />
      )}
      <TextArea {...FIELDS.exploration} defaultValue={mood.exploration} />
    </EditEvent>
  );
}
