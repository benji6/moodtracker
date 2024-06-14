import { Button, Dialog, Icon } from "eri";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import { EventTypeCategories } from "../../types";
import eventsSlice from "../../store/eventsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Props {
  eventType: EventTypeCategories;
  id: string;
  onClose(): void;
  open: boolean;
}

export default function DeleteEventDialog({
  eventType,
  id,
  onClose,
  open,
}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      title={`Delete ${EVENT_TYPE_TO_LABELS[eventType].default}?`}
    >
      <Button.Group>
        <Button
          danger
          onClick={() => {
            dispatch(
              eventsSlice.actions.add({
                type: `v1/${eventType}/delete`,
                createdAt: new Date().toISOString(),
                payload: id,
              }),
            );
            navigate("/");
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
