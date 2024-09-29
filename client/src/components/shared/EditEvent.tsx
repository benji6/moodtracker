import { Button, Icon, Paper } from "eri";
import { DeviceGeolocation, EventTypeCategories } from "../../types";
import { ReactNode, forwardRef, useState } from "react";
import DeleteEventDialog from "./DeleteEventDialog";
import { ERRORS } from "../../constants";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventIcon from "./EventIcon";
import Location from "./Location";
import { dateTimeFormatter } from "../../formatters/dateTimeFormatters";
import { formatDistanceToNow } from "date-fns";
import useKeyboardSave from "../hooks/useKeyboardSave";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  eventType: EventTypeCategories;
  id: string;
  location: DeviceGeolocation | undefined;
  onSubmit(): boolean; // `true` if successful, otherwise `false`;
  showNoUpdateError: boolean;
  updatedAt: string | undefined;
}

export default forwardRef<HTMLFormElement, Props>(function EditEvent(
  { children, eventType, id, location, onSubmit, showNoUpdateError, updatedAt },
  ref,
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (onSubmit()) navigate("/");
  };
  useKeyboardSave(handleSubmit);

  const dateCreated = new Date(id);
  const dateUpdated = updatedAt ? new Date(updatedAt) : undefined;

  const { default: label } = EVENT_TYPE_TO_LABELS[eventType];

  return (
    <Paper.Group>
      <Paper>
        <h2>
          <EventIcon eventType={eventType} /> Edit {label}
        </h2>
        <p>
          <small>
            Created: {dateTimeFormatter.format(dateCreated)} (
            {formatDistanceToNow(dateCreated)} ago)
          </small>
          {dateUpdated && (
            <>
              <br />
              <small>
                Last updated: {dateTimeFormatter.format(dateUpdated)} (
                {formatDistanceToNow(dateUpdated)} ago)
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
          ref={ref}
        >
          {children}
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
          eventType={eventType}
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {location && <Location date={dateCreated} {...location} />}
    </Paper.Group>
  );
});
