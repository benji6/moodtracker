import { ERRORS, FIELDS, TIME } from "../../../constants";
import { Select, TextField } from "eri";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import IntervalInput from "../../shared/IntervalInput";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import { useDispatch } from "react-redux";

export default function AddSleep() {
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const isoDateStringNow = formatIsoDateInLocalTimezone(new Date());

  return (
    <AddEvent
      eventType="sleeps"
      onSubmit={(): true | void => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return;
        }

        const hoursSleptEl: HTMLInputElement = formEl[FIELDS.hoursSlept.name];
        const minutesSleptEl: HTMLInputElement =
          formEl[FIELDS.minutesSlept.name];

        const dateAwokeEl: HTMLInputElement = formEl[FIELDS.dateAwoke.name];
        if (dateAwokeEl.validity.valueMissing)
          setDateAwokeError(ERRORS.required);
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
                Number(hoursSleptEl.value) * TIME.minutesPerHour +
                Number(minutesSleptEl.value),
              dateAwoke: dateAwokeEl.value,
            },
          }),
        );
        return true;
      }}
      ref={formRef}
    >
      <IntervalInput>
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
      </IntervalInput>
      <TextField
        {...FIELDS.dateAwoke}
        defaultValue={isoDateStringNow}
        error={dateAwokeError}
        max={isoDateStringNow}
      />
    </AddEvent>
  );
}
