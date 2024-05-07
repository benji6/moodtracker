import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import { TextField } from "eri";
import { captureException } from "../../../sentry";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";

export default function AddWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));

    const inputEl: HTMLInputElement = formEl[FIELDS.weight.name];
    const { valueAsNumber } = inputEl;

    if (inputEl.validity.valueMissing) return setError(ERRORS.required);
    if (inputEl.validity.rangeOverflow) return setError(ERRORS.rangeOverflow);
    if (inputEl.validity.rangeUnderflow) return setError(ERRORS.rangeUnderflow);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/weights/create",
        createdAt: new Date().toISOString(),
        payload: geolocation
          ? { location: geolocation, value: valueAsNumber }
          : { value: valueAsNumber },
      }),
    );
    navigate("/weight/log");
  };

  return (
    <AddEvent eventTypeLabel="weight" ref={formRef} onSubmit={onSubmit}>
      <TextField {...FIELDS.weight} error={error} />
    </AddEvent>
  );
}
