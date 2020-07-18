import { Dialog, Button } from "eri";
import * as React from "react";
import { userPool } from "../../cognito";
import { DispatchContext } from "../AppState";
import { navigate } from "@reach/router";

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
    dispatch({ type: "user/clear" });
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
        <Button
          danger
          data-test-id="sign-out-confirm-button"
          disabled={isLoading}
          onClick={handleSignOut}
        >
          Sign out
        </Button>
        <Button disabled={isLoading} onClick={onClose} variant="secondary">
          Cancel
        </Button>
      </Button.Group>
    </Dialog>
  );
}
