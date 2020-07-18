import { Dialog, Button } from "eri";
import * as React from "react";
import { DispatchContext } from "../../AppState";
import { useNavigate } from "@reach/router";

interface Props {
  id: string;
  onClose(): void;
  open: boolean;
}

export default function DeleteDialog({ id, onClose, open }: Props) {
  const navigate = useNavigate();
  const dispatch = React.useContext(DispatchContext);

  return (
    <Dialog onClose={onClose} open={open} title="Delete mood?">
      <Button.Group>
        <Button
          danger
          onClick={() => {
            dispatch({
              type: "events/add",
              payload: {
                type: "v1/moods/delete",
                createdAt: new Date().toISOString(),
                payload: id,
              },
            });
            navigate("/");
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
