import { ERRORS, FIELDS, TEST_IDS, TIME } from "../../../constants";
import { Select, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import IntervalInput from "../../shared/IntervalInput";
import { Run } from "../../../types";
import { captureException } from "../../../sentry";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";

export default function AddRun() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [metersError, setMetersError] = useState<string | undefined>();
  const [formError, setFormError] = useState<boolean>(false);
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));

    const metersInputEl: HTMLInputElement = formEl[FIELDS.runMeters.name];
    if (metersInputEl.validity.rangeOverflow)
      return setMetersError(ERRORS.rangeOverflow);
    else if (metersInputEl.validity.rangeUnderflow)
      return setMetersError(ERRORS.rangeUnderflow);
    else if (metersInputEl.validity.stepMismatch)
      return setMetersError(ERRORS.integer);
    else setMetersError(undefined);

    const minutesInputEl: HTMLInputElement = formEl[FIELDS.runMinutes.name];
    const secondsInputEl: HTMLInputElement = formEl[FIELDS.runSeconds.name];
    if (
      !metersInputEl.value &&
      minutesInputEl.value === "0" &&
      secondsInputEl.value === "0"
    )
      return setFormError(true);
    else setFormError(false);

    const payload = {} as Run;
    if (geolocation) payload.location = geolocation;
    if (metersInputEl.value) payload.meters = metersInputEl.valueAsNumber;
    if (minutesInputEl.value !== "0" || secondsInputEl.value !== "0")
      payload.seconds =
        Number(minutesInputEl.value) * TIME.secondsPerMinute +
        Number(secondsInputEl.value);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/runs/create",
        createdAt: new Date().toISOString(),
        payload: payload,
      }),
    );
    navigate("/runs/log");
  };

  return (
    <AddEvent eventType="runs" ref={formRef} onSubmit={onSubmit}>
      <TextField {...FIELDS.runMeters} error={metersError || formError} />
      <IntervalInput>
        <Select {...FIELDS.runMinutes} error={formError}>
          {[...Array(100)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
        <Select {...FIELDS.runSeconds} error={formError}>
          {[...Array(TIME.secondsPerMinute)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
      </IntervalInput>
      <p>
        <small>
          If you leave both minutes and seconds as 0 then no time will be
          recorded, only the distance.
        </small>
      </p>
      {formError && (
        <p
          className="negative center"
          data-test-id={TEST_IDS.runNoInputErrorMessage}
        >
          Please provide distance and/or time
        </p>
      )}
    </AddEvent>
  );
}
