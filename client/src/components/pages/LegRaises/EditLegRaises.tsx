import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";

export default function EditLegRaises() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const normalizedLegRaises = useSelector(
    eventsSlice.selectors.normalizedLegRaises,
  );
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));
    setShowNoUpdateError(false);

    const inputEl: HTMLInputElement = formEl[FIELDS.legRaises.name];
    const { valueAsNumber } = inputEl;

    if (inputEl.validity.valueMissing) return setError(ERRORS.required);
    if (inputEl.validity.rangeOverflow) return setError(ERRORS.rangeOverflow);
    if (inputEl.validity.rangeUnderflow) return setError(ERRORS.rangeUnderflow);

    if (valueAsNumber === legRaises.value) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/leg-raises/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: { id: id!, value: valueAsNumber },
      }),
    );
    navigate("/");
  };

  if (!id) return <RedirectHome />;
  const legRaises = normalizedLegRaises.byId[id];
  if (!legRaises) return <RedirectHome />;

  return (
    <EditEvent
      eventType="leg-raises"
      id={id}
      location={legRaises.location}
      onSubmit={onSubmit}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={legRaises.updatedAt}
    >
      <TextField
        {...FIELDS.legRaises}
        defaultValue={legRaises.value}
        error={error}
      />
    </EditEvent>
  );
}
