import "./style.css";
import { Button, Icon, Paper, Select, TextField } from "eri";
import { ERRORS, FIELDS, TEST_IDS, TIME } from "../../../constants";
import { useRef, useState } from "react";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import { useDispatch } from "react-redux";
import useKeyboardSave from "../../hooks/useKeyboardSave";
import { useNavigate } from "react-router-dom";

export default function AddSleep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;

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

  useKeyboardSave(handleSubmit);

  const isoDateStringNow = formatIsoDateInLocalTimezone(new Date());

  return (
    <Paper.Group data-test-id={TEST_IDS.sleepAddPage}>
      <Paper>
        <h2>Add sleep</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
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
          <Button.Group>
            <Button data-test-id={TEST_IDS.sleepAddSubmitButton}>
              <Icon margin="end" name="save" />
              Save
            </Button>
          </Button.Group>
        </form>
      </Paper>
    </Paper.Group>
  );
}
