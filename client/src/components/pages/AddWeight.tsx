import * as React from "react";
import { Button, Paper, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../store/eventsSlice";
import { Weight } from "../../types";
import { ERRORS, FIELDS, TEST_IDS } from "../../constants";
import useKeyboardSave from "../hooks/useKeyboardSave";
import { deviceGeolocationSelector } from "../../selectors";
import { useNavigate } from "react-router-dom";
import LiveLocation from "../shared/LiveLocation";

export default function AddWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string | undefined>();
  const geolocation = useSelector(deviceGeolocationSelector);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    const inputEl: HTMLInputElement = formEl[FIELDS.weight.name];
    const { value } = inputEl;

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

    const payload: Weight = { value: Number(value) };
    if (geolocation) payload.location = geolocation;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/weights/create",
        createdAt: new Date().toISOString(),
        payload,
      })
    );
    navigate("/weight/stats");
  };

  useKeyboardSave(handleSubmit);

  return (
    <Paper.Group data-test-id={TEST_IDS.weightAddPage}>
      <Paper>
        <h2>Add weight</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <TextField {...FIELDS.weight} error={error} />
          <Button.Group>
            <Button data-test-id={TEST_IDS.weightAddSubmitButton}>
              Submit
            </Button>
          </Button.Group>
        </form>
      </Paper>
      <LiveLocation />
    </Paper.Group>
  );
}
