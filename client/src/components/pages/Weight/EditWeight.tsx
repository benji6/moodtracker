import { Button, Icon, Paper, TextField } from "eri";
import { ERRORS, FIELDS } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import DeleteEventDialog from "../../shared/DeleteEventDialog";
import Location from "../../shared/Location";
import RedirectHome from "../../shared/RedirectHome";
import TimeDisplayForEditEventForm from "../../shared/TimeDisplayForEditEventForm";
import eventsSlice from "../../../store/eventsSlice";
import useKeyboardSave from "../../hooks/useKeyboardSave";

export default function EditWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const weights = useSelector(eventsSlice.selectors.normalizedWeights);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    setShowNoUpdateError(false);

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

    if (valueAsNumber === weight.value) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/weights/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: { id: id!, value: valueAsNumber },
      }),
    );
    navigate("/weight/log");
  };
  useKeyboardSave(handleSubmit);

  if (!id) return <RedirectHome />;
  const weight = weights.byId[id];
  if (!weight) return <RedirectHome />;

  const dateCreated = new Date(id);

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit weight</h2>
        <TimeDisplayForEditEventForm
          dateCreated={dateCreated}
          dateUpdated={
            weight.updatedAt ? new Date(weight.updatedAt) : undefined
          }
        />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <TextField
            {...FIELDS.weight}
            defaultValue={weight.value}
            error={error}
          />
          {showNoUpdateError && (
            <p className="center negative">{ERRORS.noChanges}</p>
          )}
          <Button.Group>
            <Button>
              <Icon margin="end" name="save" />
              Save
            </Button>
            <Button danger onClick={() => setIsDialogOpen(true)} type="button">
              <Icon margin="end" name="trash" />
              Delete
            </Button>
            <Button
              onClick={() => window.history.back()}
              type="button"
              variant="secondary"
            >
              <Icon margin="end" name="left" />
              Back
            </Button>
          </Button.Group>
        </form>
        <DeleteEventDialog
          eventType="weight"
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {weight.location && <Location date={dateCreated} {...weight.location} />}
    </Paper.Group>
  );
}
