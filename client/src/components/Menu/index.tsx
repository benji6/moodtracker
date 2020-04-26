import { Menu as EriMenu, Button } from "eri";
import * as React from "react";
import { StateContext } from "../AppState";
import SignOutDialog from "./SignOutDialog";
import SyncState from "./SyncState";

interface Props {
  open: boolean;
  handleMenuClose(): void;
}

export default function Menu({ handleMenuClose, open }: Props) {
  const { userEmail } = React.useContext(StateContext);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleMenuClose();
  };

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {userEmail && (
          <>
            <strong>Signed in</strong>
            <p>
              <em>{userEmail}</em>
            </p>
            <Button.Group>
              <Button
                danger
                onClick={() => setIsDialogOpen(true)}
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
          <EriMenu.Link onClick={handleMenuClose} to="/add">
            Add mood
          </EriMenu.Link>
          {!userEmail && (
            <>
              <EriMenu.Link onClick={handleMenuClose} to="/sign-in">
                Sign in
              </EriMenu.Link>
              <EriMenu.Link onClick={handleMenuClose} to="/sign-up">
                Sign up
              </EriMenu.Link>
            </>
          )}
          <EriMenu.Link onClick={handleMenuClose} to="about">
            About
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="see-also">
            See also
          </EriMenu.Link>
        </EriMenu.List>
        {userEmail && <SyncState />}
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
