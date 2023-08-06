import { Dialog, Button, Icon } from "eri";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TEST_IDS } from "../../constants";
import { eventsIdsToSyncSelector } from "../../selectors";
import signOut from "../../signout";

interface Props {
  onClose(): void;
  open: boolean;
}

export default function SignOutDialog({ onClose, open }: Props) {
  const idsToSync = useSelector(eventsIdsToSyncSelector);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    onClose();
    setIsLoading(false);
  };

  return (
    <Dialog
      disableClose={isLoading}
      onClose={onClose}
      open={open}
      title="Sign out?"
    >
      {idsToSync.length ? (
        <p>
          <strong>
            WARNING: some of your data has not yet been synced to the server and
            will be lost if you sign out now. If you don&apos;t want to lose any
            data please connect to the internet to sync before logging out.
          </strong>
        </p>
      ) : (
        <p>Safe to sign out, all data is synced to the server.</p>
      )}
      <Button.Group>
        <Button
          danger
          data-test-id={TEST_IDS.signOutConfirmButton}
          disabled={isLoading}
          onClick={handleSignOut}
        >
          <Icon margin="end" name="sign-out" />
          Sign out
        </Button>
        <Button disabled={isLoading} onClick={onClose} variant="secondary">
          <Icon margin="end" name="cross" />
          Cancel
        </Button>
      </Button.Group>
    </Dialog>
  );
}
