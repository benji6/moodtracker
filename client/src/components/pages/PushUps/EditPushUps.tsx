import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";

export default function EditPushUps() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));
    setShowNoUpdateError(false);

    const inputEl: HTMLInputElement = formEl[FIELDS.pushUps.name];
    const { valueAsNumber } = inputEl;

    if (inputEl.validity.valueMissing) return setError(ERRORS.required);
    if (inputEl.validity.rangeOverflow) return setError(ERRORS.rangeOverflow);
    if (inputEl.validity.rangeUnderflow) return setError(ERRORS.rangeUnderflow);

    if (valueAsNumber === pushUps.value) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/push-ups/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: { id: id!, value: valueAsNumber },
      }),
    );
    navigate("/push-ups/log");
  };

  if (!id) return <RedirectHome />;
  const pushUps = normalizedPushUps.byId[id];
  if (!pushUps) return <RedirectHome />;

  return (
    <EditEvent
      eventType="push-ups"
      eventTypeLabel="push-ups"
      id={id}
      location={pushUps.location}
      onSubmit={onSubmit}
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
