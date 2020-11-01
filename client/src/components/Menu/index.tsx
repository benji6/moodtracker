import { Menu as EriMenu, Button } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { userEmailSelector, userIsSignedInSelector } from "../../selectors";
import SignOutDialog from "./SignOutDialog";
import SyncState from "./SyncState";

interface Props {
  open: boolean;
  handleMenuClose(): void;
}

export default function Menu({ handleMenuClose, open }: Props) {
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleMenuClose();
  };

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {userIsSignedIn && (
          <>
            <strong>Signed in</strong>
            <p>
              <em>{userEmail}</em>
            </p>
            <Button.Group>
              <Button
                danger
                data-test-id="sign-out-button"
                onClick={() => setIsDialogOpen(true)}
                type="button"
                variant="secondary"
              >
                Sign out
              </Button>
            </Button.Group>
            <hr />
          </>
        )}
        <EriMenu.List>
          <EriMenu.Link onClick={handleMenuClose} to="/">
            Home
          </EriMenu.Link>
          {userIsSignedIn && (
            <>
              <EriMenu.Link onClick={handleMenuClose} to="/add">
                Add mood
              </EriMenu.Link>
              <EriMenu.Link onClick={handleMenuClose} to="/stats">
                Stats
              </EriMenu.Link>
              <EriMenu.SubList>
                <EriMenu.Link onClick={handleMenuClose} to="/stats/explore">
                  Explore
                </EriMenu.Link>
              </EriMenu.SubList>
            </>
          )}
          <EriMenu.Link onClick={handleMenuClose} to="/about">
            About
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="/see-also">
            See also
          </EriMenu.Link>
        </EriMenu.List>
        {userIsSignedIn && <SyncState />}
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
