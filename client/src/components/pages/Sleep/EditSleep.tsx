import { ERRORS, FIELDS, TIME } from "../../../constants";
import { Select, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import EditEvent from "../../shared/EditEvent";
import RedirectHome from "../../shared/RedirectHome";
import { captureException } from "../../../sentry";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";

export default function EditSleep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const { id } = useParams();
  const sleeps = useSelector(eventsSlice.selectors.normalizedSleeps);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const formEl = formRef.current;
    if (!formEl) return captureException(Error("Form ref is undefined"));
    setShowNoUpdateError(false);

    const hoursSleptEl: HTMLInputElement = formEl[FIELDS.hoursSlept.name];
    const minutesSleptEl: HTMLInputElement = formEl[FIELDS.minutesSlept.name];

    const dateAwokeEl: HTMLInputElement = formEl[FIELDS.dateAwoke.name];
    if (dateAwokeEl.validity.valueMissing) setDateAwokeError(ERRORS.required);
    else if (dateAwokeEl.validity.rangeOverflow)
      setDateAwokeError(ERRORS.rangeOverflow);
    else setDateAwokeError(undefined);

    if (!dateAwokeEl.validity.valid) return;

    const minutesSlept =
      Number(hoursSleptEl.value) * 60 + Number(minutesSleptEl.value);
    if (
      minutesSlept === sleep.minutesSlept &&
      dateAwokeEl.value === sleep.dateAwoke
    )
      return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/sleeps/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: {
          dateAwoke: dateAwokeEl.value,
          id: id!,
          minutesSlept,
        },
      }),
    );
    navigate("/sleep/log");
  };

  if (!id) return <RedirectHome />;
  const sleep = sleeps.byId[id];
  if (!sleep) return <RedirectHome />;

  return (
    <EditEvent
      eventType="sleeps"
      eventTypeLabel="sleep"
      id={id}
      location={undefined}
      onSubmit={onSubmit}
      ref={formRef}
      showNoUpdateError={showNoUpdateError}
      updatedAt={sleep.updatedAt}
    >
      <div className="m-interval-input">
        <Select
          {...FIELDS.hoursSlept}
          defaultValue={Math.floor(sleep.minutesSlept / TIME.minutesPerHour)}
        >
          {[...Array(TIME.hoursPerDay)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
        <Select
          {...FIELDS.minutesSlept}
          defaultValue={sleep.minutesSlept % TIME.minutesPerHour}
        >
          {[...Array(TIME.minutesPerHour)].map((_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </Select>
      </div>
      <TextField
        {...FIELDS.dateAwoke}
        defaultValue={sleep.dateAwoke}
        error={dateAwokeError}
        max={formatIsoDateInLocalTimezone(new Date())}
      />
    </EditEvent>
  );
}
