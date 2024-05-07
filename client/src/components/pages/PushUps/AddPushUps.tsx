import { Button, Icon, Paper, TextField } from "eri";
import { ERRORS, FIELDS, TEST_IDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import LiveLocation from "../../shared/LiveLocation";
import deviceSlice from "../../../store/deviceSlice";
import eventsSlice from "../../../store/eventsSlice";
import useKeyboardSave from "../../hooks/useKeyboardSave";
import { useNavigate } from "react-router-dom";

export default function AddPushUps() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    const inputEl: HTMLInputElement = formEl[FIELDS.pushUps.name];
    const { valueAsNumber } = inputEl;

    if (inputEl.validity.valueMissing) {
      setError(ERRORS.required);
      return;
    }
    if (inputEl.validity.rangeOverflow) {
      setError(ERRORS.rangeOverflow);
      return;
    }
    if (inputEl.validity.rangeUnderflow) {
      setError(ERRORS.rangeUnderflow);
      return;
    }
    if (inputEl.validity.stepMismatch) {
      setError(ERRORS.integer);
      return;
    }

    const payload = geolocation
      ? { location: geolocation, value: valueAsNumber }
      : { value: valueAsNumber };

    dispatch(
      eventsSlice.actions.add({
        type: "v1/push-ups/create",
        createdAt: new Date().toISOString(),
        payload,
      }),
    );
    navigate("/push-ups/log");
  };

  useKeyboardSave(handleSubmit);

  return (
    <Paper.Group data-test-id={TEST_IDS.pushUpsAddPage}>
      <Paper>
        <h2>Add push-ups</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <TextField {...FIELDS.pushUps} error={error} />
          <Button.Group>
            <Button data-test-id={TEST_IDS.pushUpsAddSubmitButton}>
              <Icon margin="end" name="save" />
              Save
            </Button>
          </Button.Group>
        </form>
      </Paper>
      <LiveLocation />
    </Paper.Group>
  );
}
