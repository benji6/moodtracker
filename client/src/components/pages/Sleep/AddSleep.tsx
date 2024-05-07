import "./style.css";
import { ERRORS, FIELDS, TIME } from "../../../constants";
import { Select, TextField } from "eri";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function AddSleep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));

    const hoursSleptEl: HTMLInputElement = formEl[FIELDS.hoursSlept.name];
    const minutesSleptEl: HTMLInputElement = formEl[FIELDS.minutesSlept.name];

    const dateAwokeEl: HTMLInputElement = formEl[FIELDS.dateAwoke.name];
    if (dateAwokeEl.validity.valueMissing) setDateAwokeError(ERRORS.required);
    else if (dateAwokeEl.validity.rangeOverflow)
      setDateAwokeError(ERRORS.rangeOverflow);
    else setDateAwokeError(undefined);

    if (!dateAwokeEl.validity.valid) return;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/sleeps/create",
        createdAt: new Date().toISOString(),
        payload: {
          minutesSlept:
            Number(hoursSleptEl.value) * 60 + Number(minutesSleptEl.value),
          dateAwoke: dateAwokeEl.value,
        },
      }),
    );
    navigate("/sleep/log");
  };

  const isoDateStringNow = formatIsoDateInLocalTimezone(new Date());

  return (
    <AddEvent eventTypeLabel="sleep" ref={formRef} onSubmit={onSubmit}>
      <div className="m-interval-input">
        <Select {...FIELDS.hoursSlept}>
          {[...Array(TIME.hoursPerDay)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
        <Select {...FIELDS.minutesSlept}>
          {[...Array(TIME.minutesPerHour)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <TextField
        {...FIELDS.dateAwoke}
        defaultValue={isoDateStringNow}
        error={dateAwokeError}
        max={isoDateStringNow}
      />
    </AddEvent>
  );
}
