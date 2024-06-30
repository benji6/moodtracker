import { ERRORS, FIELDS, TIME } from "../../../constants";
import { Select, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import IntervalInput from "../../shared/IntervalInput";
import RedirectHome from "../../shared/RedirectHome";
import { UpdateRun } from "../../../types";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { useParams } from "react-router-dom";

export default function EditRun() {
  const dispatch = useDispatch();
  const [metersError, setMetersError] = useState<string | undefined>();
  const [formError, setFormError] = useState<boolean>(false);
  const { id } = useParams();
  const normalizedEvents = useSelector(eventsSlice.selectors.normalizedRuns);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  if (!id) return <RedirectHome />;
  const event = normalizedEvents.byId[id];
  if (!event) return <RedirectHome />;

  return (
    <EditEvent
      eventType="runs"
      id={id}
      location={event.location}
      onSubmit={(): true | void => {
        const formEl = formRef.current;
        if (!formEl) {
          captureException(Error("Form ref is undefined"));
          return;
        }

        setShowNoUpdateError(false);

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

        const formMeters: number | undefined = metersInputEl.value
          ? metersInputEl.valueAsNumber
          : undefined;
        const formSeconds: number | undefined =
          minutesInputEl.value === "0" && secondsInputEl.value === "0"
            ? undefined
            : Number(minutesInputEl.value) * TIME.secondsPerMinute +
              Number(secondsInputEl.value);

        if (formMeters === event.meters && formSeconds === event.seconds)
          return setShowNoUpdateError(true);

        const payload = { id } as UpdateRun;
        if (formMeters !== event.meters) payload.meters = formMeters;
        if (formSeconds !== event.seconds) payload.seconds = formSeconds;

        dispatch(
          eventsSlice.actions.add({
            type: "v1/runs/update",
            createdAt: new Date().toISOString(),
            payload,
          }),
        );
        return true;
      }}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={event.updatedAt}
    >
      <TextField
        {...FIELDS.runMeters}
        defaultValue={event.meters}
        error={metersError || formError}
      />
      <IntervalInput>
        <Select
          {...FIELDS.runMinutes}
          defaultValue={
            event.seconds === undefined
              ? undefined
              : Math.floor(event.seconds / TIME.secondsPerMinute)
          }
          error={formError}
        >
          {[...Array(100)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
        <Select
          {...FIELDS.runSeconds}
          defaultValue={
            event.seconds === undefined
              ? undefined
              : event.seconds % TIME.secondsPerMinute
          }
          error={formError}
        >
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
        <p className="negative center ">Please provide distance and/or time</p>
      )}
    </EditEvent>
  );
}
