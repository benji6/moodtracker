import { Button, Icon, Paper } from "eri";
import { DeviceGeolocation, EventTypeCategories } from "../../types";
import { ReactNode, forwardRef, useState } from "react";
import DeleteEventDialog from "./DeleteEventDialog";
import { ERRORS } from "../../constants";
import Location from "./Location";
import { dateTimeFormatter } from "../../formatters/dateTimeFormatters";
import { formatDistanceToNow } from "date-fns";
import useKeyboardSave from "../hooks/useKeyboardSave";

interface Props {
  children: ReactNode;
  eventType: EventTypeCategories;
  eventTypeLabel: string;
  id: string;
  location: DeviceGeolocation | undefined;
  onSubmit(): void;
  showNoUpdateError: boolean;
  updatedAt: string | undefined;
}

export default forwardRef<HTMLFormElement, Props>(function EditEvent(
  {
    children,
    eventType,
    eventTypeLabel,
    id,
    location,
    onSubmit,
    showNoUpdateError,
    updatedAt,
  },
  ref,
) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useKeyboardSave(onSubmit);

  const dateCreated = new Date(id);
  const dateUpdated = updatedAt ? new Date(updatedAt) : undefined;

  return (
    <Paper.Group>
      <Paper>
        <h2>Edit {eventTypeLabel}</h2>
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
            onSubmit();
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
          eventTypeLabel={eventTypeLabel}
          id={id}
          onClose={() => setIsDialogOpen(false)}
          open={isDialogOpen}
        />
      </Paper>
      {location && <Location date={dateCreated} {...location} />}
    </Paper.Group>
  );
});
