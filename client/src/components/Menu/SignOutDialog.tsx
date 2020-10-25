import { Dialog, Button } from "eri";
import * as React from "react";
import { useDispatch } from "react-redux";
import { userPool } from "../../cognito";
import userSlice from "../../store/userSlice";
import { DispatchContext, StateContext } from "../AppState";

interface Props {
  onClose(): void;
  open: boolean;
}

export default function SignOutDialog({ onClose, open }: Props) {
  const state = React.useContext(StateContext);
  const dispatch = useDispatch();
  const appDispatch = React.useContext(DispatchContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = () => {
    setIsLoading(true);
    const currentUser = userPool.getCurrentUser();
    if (currentUser) currentUser.signOut();
    onClose();
    dispatch(userSlice.actions.clear());
    appDispatch({ type: "app/signOut" });
    setIsLoading(false);
  };

  return (
    <Dialog
      disableClose={isLoading}
      onClose={onClose}
      open={open}
      title="Sign out?"
    >
      {state.events.idsToSync.length ? (
        <p>
          <strong>
            WARNING: some of your data has not yet been synced to the server and
            will be lost if you sign out now. If you don't want to lose any data
            please connect to the internet to sync before logging out.
          </strong>
        </p>
      ) : (
        <p>Safe to sign out, all data is synced to the server.</p>
      )}
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
