import { Button, Icon, Paper, TextField } from "eri";
import { ERRORS, FIELDS, TEST_IDS, TIME } from "../../../constants";
import { useRef, useState } from "react";
import eventsSlice from "../../../store/eventsSlice";
import { useDispatch } from "react-redux";
import useKeyboardSave from "../../hooks/useKeyboardSave";
import { useNavigate } from "react-router-dom";

export default function AddSleep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const [timeSleptError, setTimeSleptError] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;

    const timeSleptEl: HTMLInputElement = formEl[FIELDS.timeSlept.name];
    if (timeSleptEl.validity.valueMissing) setTimeSleptError(ERRORS.required);
    else if (timeSleptEl.validity.rangeUnderflow)
      setTimeSleptError(ERRORS.rangeUnderflow);
    else setTimeSleptError(undefined);

    const dateAwokeEl: HTMLInputElement = formEl[FIELDS.dateAwoke.name];
    if (dateAwokeEl.validity.valueMissing) setDateAwokeError(ERRORS.required);
    else if (dateAwokeEl.validity.rangeOverflow)
      setDateAwokeError(ERRORS.rangeOverflow);
    else setDateAwokeError(undefined);

    if (!timeSleptEl.validity.valid || !dateAwokeEl.validity.valid) return;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/sleeps/create",
        createdAt: new Date().toISOString(),
        payload: {
          minutesSlept: timeSleptEl.valueAsNumber / 1e3 / TIME.secondsPerMinute,
          dateAwoke: dateAwokeEl.value,
        },
      }),
    );
    navigate("/sleep/log");
  };

  useKeyboardSave(handleSubmit);

  const isoDateStringNow = new Date().toISOString().slice(0, 10);

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
          <TextField
            {...FIELDS.timeSlept}
            defaultValue="00:00"
            error={timeSleptError}
          />
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
