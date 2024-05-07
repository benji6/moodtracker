import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";

export default function EditWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const weights = useSelector(eventsSlice.selectors.normalizedWeights);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));
    setShowNoUpdateError(false);

    const inputEl: HTMLInputElement = formEl[FIELDS.weight.name];
    const { valueAsNumber } = inputEl;

    if (inputEl.validity.valueMissing) return setError(ERRORS.required);
    if (inputEl.validity.rangeOverflow) return setError(ERRORS.rangeOverflow);
    if (inputEl.validity.rangeUnderflow) return setError(ERRORS.rangeUnderflow);

    if (valueAsNumber === weight.value) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/weights/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: { id: id!, value: valueAsNumber },
      }),
    );
    navigate("/weight/log");
  };

  if (!id) return <RedirectHome />;
  const weight = weights.byId[id];
  if (!weight) return <RedirectHome />;

  return (
    <EditEvent
      eventType="weights"
      eventTypeLabel="weight"
      id={id}
      location={weight.location}
      onSubmit={onSubmit}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={weight.updatedAt}
    >
      <TextField {...FIELDS.weight} defaultValue={weight.value} error={error} />
    </EditEvent>
  );
}
