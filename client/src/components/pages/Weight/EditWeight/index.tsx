import * as React from "react";
import { Button, Icon, Paper, TextField } from "eri";
import WeightDeleteDialog from "./WeightDeleteDialog";
import { normalizedWeightsSelector } from "../../../../selectors";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../../../store/eventsSlice";
import { ERRORS, FIELDS } from "../../../../constants";
import useKeyboardSave from "../../../hooks/useKeyboardSave";
import { dateTimeFormatter } from "../../../../formatters/dateTimeFormatters";
import Location from "../../../shared/Location";
import RedirectHome from "../../../shared/RedirectHome";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export default function EditWeight() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = React.useState<string | undefined>();
  const { id } = useParams();
  const weights = useSelector(normalizedWeightsSelector);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [showNoUpdateError, setShowNoUpdateError] = React.useState(false);

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

  const createdDate = new Date(id);
  const updatedDate = weight.updatedAt ? new Date(weight.updatedAt) : undefined;

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit weight</h2>
        <p>
          <small>
            Created: {dateTimeFormatter.format(createdDate)} (
            {formatDistanceToNow(createdDate)} ago)
          </small>
          {updatedDate && (
            <>
              <br />
              <small>
                Last updated: {dateTimeFormatter.format(updatedDate)} (
                {formatDistanceToNow(updatedDate)} ago)
              </small>
            </>
          )}
        </p>
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
        <WeightDeleteDialog
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {weight.location && <Location date={createdDate} {...weight.location} />}
    </Paper.Group>
  );
}
