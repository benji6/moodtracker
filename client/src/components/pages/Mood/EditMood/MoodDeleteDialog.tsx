import { Button, Dialog, Icon } from "eri";
import eventsSlice from "../../../../store/eventsSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  onClose(): void;
  open: boolean;
}

export default function MoodDeleteDialog({ id, onClose, open }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Dialog onClose={onClose} open={open} title="Delete mood?">
      <Button.Group>
        <Button
          danger
          onClick={() => {
            dispatch(
              eventsSlice.actions.add({
                type: "v1/moods/delete",
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
