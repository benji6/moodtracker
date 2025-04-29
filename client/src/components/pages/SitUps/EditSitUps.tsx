import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { useParams } from "react-router";

export default function EditSitUps() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const normalizedSitUps = useSelector(eventsSlice.selectors.normalizedSitUps);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  if (!id) return <RedirectHome />;
  const sitUps = normalizedSitUps.byId[id];
  if (!sitUps) return <RedirectHome />;

  return (
    <EditEvent
      eventType="sit-ups"
      id={id}
      location={sitUps.location}
      onSubmit={(): boolean => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return false;
        }
        setShowNoUpdateError(false);

        const inputEl: HTMLInputElement = formEl[FIELDS.sitUps.name];
        const { valueAsNumber } = inputEl;

        if (inputEl.validity.valueMissing) {
          setError(ERRORS.required);
          return false;
        }
        if (inputEl.validity.rangeOverflow) {
          setError(ERRORS.rangeOverflow);
          return false;
        }
        if (inputEl.validity.rangeUnderflow) {
          setError(ERRORS.rangeUnderflow);
          return false;
        }

        if (valueAsNumber === sitUps.value) {
          setShowNoUpdateError(true);
          return false;
        }

        dispatch(
          eventsSlice.actions.add({
            type: "v1/sit-ups/update",
            createdAt: new Date().toISOString(),
            payload: { id, value: valueAsNumber },
          }),
        );
        return true;
      }}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={sitUps.updatedAt}
    >
      <TextField {...FIELDS.sitUps} defaultValue={sitUps.value} error={error} />
    </EditEvent>
  );
}
