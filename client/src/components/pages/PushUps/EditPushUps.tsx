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

export default function EditPushUps() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | undefined>();
  const { id } = useParams();
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
    setShowNoUpdateError(false);

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

    if (valueAsNumber === pushUps.value) return setShowNoUpdateError(true);

    dispatch(
      eventsSlice.actions.add({
        type: "v1/push-ups/update",
        createdAt: new Date().toISOString(),
        // The user is redirected if `id` is not defined
        payload: { id: id!, value: valueAsNumber },
      }),
    );
    navigate("/push-ups/log");
  };
  useKeyboardSave(handleSubmit);

  if (!id) return <RedirectHome />;
  const pushUps = normalizedPushUps.byId[id];
  if (!pushUps) return <RedirectHome />;

  const dateCreated = new Date(id);

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit push-ups</h2>
        <TimeDisplayForEditEventForm
          dateCreated={dateCreated}
          dateUpdated={
            pushUps.updatedAt ? new Date(pushUps.updatedAt) : undefined
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
            {...FIELDS.pushUps}
            defaultValue={pushUps.value}
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
          eventType="push-ups"
          eventTypeText="push-ups"
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {pushUps.location && (
        <Location date={dateCreated} {...pushUps.location} />
      )}
    </Paper.Group>
  );
}
