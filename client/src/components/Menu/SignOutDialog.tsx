import { navigate } from "@reach/router";
import { Dialog, Button } from "eri";
import * as React from "react";
import { userPool } from "../../cognito";
import { DispatchContext } from "../AppState";

interface Props {
  onClose(): void;
  open: boolean;
}

export default function SignOutDialog({ onClose, open }: Props) {
  const dispatch = React.useContext(DispatchContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = () => {
    setIsLoading(true);
    const currentUser = userPool.getCurrentUser();
    if (currentUser) currentUser.signOut();
    onClose();
    dispatch({ type: "events/deleteAll" });
    dispatch({ type: "user/clearEmail" });
    navigate("/");
    setIsLoading(false);
  };

  return (
    <Dialog
      disableClose={isLoading}
      onClose={onClose}
      open={open}
      title="Sign out?"
    >
      <Button.Group>
        <Button danger disabled={isLoading} onClick={handleSignOut}>
          Sign out
        </Button>
        <Button disabled={isLoading} onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </Button.Group>
    </Dialog>
  );
}
