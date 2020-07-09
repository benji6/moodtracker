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
  const { user } = React.useContext(StateContext);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleMenuClose();
  };

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {user.email && (
          <>
            <strong>Signed in</strong>
            <p>
              <em>{user.email}</em>
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
          {user.email && (
            <>
              <EriMenu.Link onClick={handleMenuClose} to="/add">
                Add mood
              </EriMenu.Link>
              <EriMenu.Link onClick={handleMenuClose} to="/stats">
                Stats
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
        {user.email && <SyncState />}
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
