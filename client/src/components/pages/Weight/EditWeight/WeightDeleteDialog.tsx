import { Dialog, Button } from "eri";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import eventsSlice from "../../../../store/eventsSlice";

interface Props {
  id: string;
  onClose(): void;
  open: boolean;
}

export default function WeightDeleteDialog({ id, onClose, open }: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Dialog onClose={onClose} open={open} title="Delete weight?">
      <Button.Group>
        <Button
          danger
          onClick={() => {
            dispatch(
              eventsSlice.actions.add({
                type: "v1/weights/delete",
                createdAt: new Date().toISOString(),
                payload: id,
              })
            );
            navigate("/weight/log");
          }}
        >
          Delete
        </Button>
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </Button.Group>
    </Dialog>
  );
}
