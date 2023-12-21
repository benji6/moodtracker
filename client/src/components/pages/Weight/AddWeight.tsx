import * as React from "react";
import { Button, Icon, Paper, TextField } from "eri";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../../store/eventsSlice";
import { Weight } from "../../../types";
import { ERRORS, FIELDS, TEST_IDS } from "../../../constants";
import useKeyboardSave from "../../hooks/useKeyboardSave";
import { useNavigate } from "react-router-dom";
import LiveLocation from "../../shared/LiveLocation";
import deviceSlice from "../../../store/deviceSlice";

export default function AddWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string | undefined>();
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    const inputEl: HTMLInputElement = formEl[FIELDS.weight.name];
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

    const payload: Weight = { value: valueAsNumber };
    if (geolocation) payload.location = geolocation;

    dispatch(
      eventsSlice.actions.add({
        type: "v1/weights/create",
        createdAt: new Date().toISOString(),
        payload,
      }),
    );
    navigate("/weight/log");
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
