import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { useParams } from "react-router";

export default function EditPushUps() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  if (!id) return <RedirectHome />;
  const pushUps = normalizedPushUps.byId[id];
  if (!pushUps) return <RedirectHome />;

  return (
    <EditEvent
      eventType="push-ups"
      id={id}
      location={pushUps.location}
      onSubmit={(): boolean => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return false;
        }
        setShowNoUpdateError(false);

        const inputEl: HTMLInputElement = formEl[FIELDS.pushUps.name];
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

        if (valueAsNumber === pushUps.value) {
          setShowNoUpdateError(true);
          return false;
        }

        dispatch(
          eventsSlice.actions.add({
            type: "v1/push-ups/update",
            createdAt: new Date().toISOString(),
            payload: { id, value: valueAsNumber },
          }),
        );
        return true;
      }}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={pushUps.updatedAt}
    >
      <TextField
        {...FIELDS.pushUps}
        defaultValue={pushUps.value}
        error={error}
      />
    </EditEvent>
  );
}
