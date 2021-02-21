import startOfWeek from "date-fns/startOfWeek";
import { Menu as EriMenu, Button, Icon } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { WEEK_OPTIONS } from "../../formatters";
import { userEmailSelector, userIsSignedInSelector } from "../../selectors";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../utils";
import SignOutDialog from "./SignOutDialog";
import SyncState from "./SyncState";
import "./style.css";

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

  const now = new Date();

  return (
    <>
      <EriMenu onClose={handleMenuClose} open={open}>
        {userIsSignedIn && (
          <div className="m-menu__header">
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
          </div>
        )}
        <EriMenu.List>
          <EriMenu.Link onClick={handleMenuClose} to="/">
            <Icon margin="right" name="home" />
            Home
          </EriMenu.Link>
          {userIsSignedIn ? (
            <>
              <EriMenu.Link onClick={handleMenuClose} to="/add">
                <Icon margin="right" name="plus" />
                Add mood
              </EriMenu.Link>
              <EriMenu.Link onClick={handleMenuClose} to="/stats">
                <Icon margin="right" name="chart" />
                Stats
              </EriMenu.Link>
              <EriMenu.SubList>
                <EriMenu.Link
                  onClick={handleMenuClose}
                  to={`/stats/weeks/${formatIsoDateInLocalTimezone(
                    startOfWeek(now, WEEK_OPTIONS)
                  )}`}
                >
                  <Icon margin="right" name="chart" />
                  This week
                </EriMenu.Link>
                <EriMenu.Link
                  onClick={handleMenuClose}
                  to={`/stats/months/${formatIsoMonthInLocalTimezone(now)}`}
                >
                  <Icon margin="right" name="chart" />
                  This month
                </EriMenu.Link>
                <EriMenu.Link
                  onClick={handleMenuClose}
                  to={`/stats/years/${formatIsoYearInLocalTimezone(now)}`}
                >
                  <Icon margin="right" name="chart" />
                  This year
                </EriMenu.Link>
                <EriMenu.Link onClick={handleMenuClose} to="/stats/explore">
                  <Icon margin="right" name="chart" />
                  Explore
                </EriMenu.Link>
              </EriMenu.SubList>
              <EriMenu.Link onClick={handleMenuClose} to="/change-password">
                <Icon margin="right" name="lock" />
                Change password
              </EriMenu.Link>
              <EriMenu.Link onClick={handleMenuClose} to="/export">
                <Icon margin="right" name="download" />
                Export data
              </EriMenu.Link>
            </>
          ) : (
            <EriMenu.Link onClick={handleMenuClose} to="/sign-in">
              <Icon margin="right" name="key" />
              Sign in
            </EriMenu.Link>
          )}
          <EriMenu.Link onClick={handleMenuClose} to="/about">
            <Icon margin="right" name="help" />
            About
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="/blog">
            <Icon margin="right" name="book" />
            Blog
          </EriMenu.Link>
          <EriMenu.Link onClick={handleMenuClose} to="/see-also">
            <Icon margin="right" name="link" />
            See also
          </EriMenu.Link>
        </EriMenu.List>
        {userIsSignedIn && <SyncState />}
      </EriMenu>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
