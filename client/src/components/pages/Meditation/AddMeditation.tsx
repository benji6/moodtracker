import { TIME } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import AddEvent from "../../shared/AddEvent";
import { Select } from "eri";
import IntervalInput from "../../shared/IntervalInput";
import { captureException } from "../../../sentry";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";

export default function AddMeditation() {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <AddEvent
      eventType="meditations"
      ref={formRef}
      onSubmit={(): boolean => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return false;
        }

        const minutesEl: HTMLInputElement = formEl["minutes"];
        const secondsEl: HTMLInputElement = formEl["seconds"];

        const minutesAsNumber = Number(minutesEl.value);
        const secondsAsNumber = Number(secondsEl.value);

        const seconds =
          minutesAsNumber * TIME.secondsPerMinute + secondsAsNumber;

        if (!seconds) {
          setError("Please provide a time");
          return false;
        }

        dispatch(
          eventsSlice.actions.add({
            type: "v1/meditations/create",
            createdAt: new Date().toISOString(),
            payload: geolocation
              ? { location: geolocation, seconds }
              : { seconds },
          }),
        );
        return true;
      }}
    >
      <IntervalInput>
        <Select label="Minutes" name="minutes">
          <option />
          {[...Array(TIME.minutesPerHour)].map((_, i) => (
            <option key={i}>{i}</option>
          ))}
        </Select>
        <Select label="Seconds" name="seconds">
          <option />
          {[...Array(TIME.secondsPerMinute)].map((_, i) => (
            <option key={i}>{i}</option>
          ))}
        </Select>
      </IntervalInput>
      {error && <p className="center negative">{error}</p>}
    </AddEvent>
  );
}
