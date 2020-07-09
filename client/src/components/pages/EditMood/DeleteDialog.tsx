import { NavigateFn } from "@reach/router";
import { Dialog, Button } from "eri";
import * as React from "react";
import { DispatchContext } from "../../AppState";

interface Props {
  id: string;
  navigate: NavigateFn;
  onClose(): void;
  open: boolean;
}

export default function DeleteDialog({ id, navigate, onClose, open }: Props) {
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
