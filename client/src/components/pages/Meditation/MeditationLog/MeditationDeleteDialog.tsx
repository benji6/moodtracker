import { Dialog, Button, Icon } from "eri";
import { useDispatch } from "react-redux";
import eventsSlice from "../../../../store/eventsSlice";
import { dateTimeFormatter } from "../../../../formatters/dateTimeFormatters";
import { captureException } from "../../../../sentry";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

interface Props {
  id: string | undefined;
  open: boolean;
  onClose(): void;
}

export default function MeditationDeleteDialog({ id, onClose, open }: Props) {
  const dispatch = useDispatch();

  return (
    <Dialog onClose={onClose} open={open} title="Delete log?">
      {id && (
        <p>
          {dateTimeFormatter.format(new Date(id))} (
          {formatDistanceToNow(new Date(id))} ago)
        </p>
      )}
      <Button.Group>
        <Button
          danger
          onClick={() => {
            if (!id) {
              captureException(
                Error("Dialog button was pressed while dialog was closed")
              );
              return;
            }
            dispatch(
              eventsSlice.actions.add({
                type: "v1/meditations/delete",
                createdAt: new Date().toISOString(),
                payload: id,
              })
            );
            onClose();
          }}
        >
          <Icon margin="end" name="trash" />
          Delete
        </Button>
        <Button onClick={onClose} variant="secondary">
          <Icon margin="end" name="cross" />
          Cancel
        </Button>
      </Button.Group>
    </Dialog>
  );
}
