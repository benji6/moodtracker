import { Button, Icon, Paper, Select, TextField } from "eri";
import { ERRORS, FIELDS, TEST_IDS, TIME } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";
import DeleteEventDialog from "../../shared/DeleteEventDialog";
import RedirectHome from "../../shared/RedirectHome";
import TimeDisplayForEditEventForm from "../../shared/TimeDisplayForEditEventForm";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import useKeyboardSave from "../../hooks/useKeyboardSave";

export default function EditSleep() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dateAwokeError, setDateAwokeError] = useState<string | undefined>();
  const { id } = useParams();
  const sleeps = useSelector(eventsSlice.selectors.normalizedSleeps);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showNoUpdateError, setShowNoUpdateError] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = () => {
    const formEl = formRef.current!;
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
  useKeyboardSave(handleSubmit);

  if (!id) return <RedirectHome />;
  const sleep = sleeps.byId[id];
  if (!sleep) return <RedirectHome />;

  const dateCreated = new Date(id);

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit sleep</h2>
        <TimeDisplayForEditEventForm
          dateCreated={dateCreated}
          dateUpdated={sleep.updatedAt ? new Date(sleep.updatedAt) : undefined}
        />
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          ref={formRef}
        >
          <div className="m-interval-input">
            <Select
              {...FIELDS.hoursSlept}
              defaultValue={Math.floor(
                sleep.minutesSlept / TIME.minutesPerHour,
              )}
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
          {showNoUpdateError && (
            <p className="center negative">{ERRORS.noChanges}</p>
          )}
          <Button.Group>
            <Button data-test-id={TEST_IDS.sleepAddSubmitButton}>
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
          eventType="sleep"
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
    </Paper.Group>
  );
}
