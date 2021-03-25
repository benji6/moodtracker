import startOfWeek from "date-fns/startOfWeek";
import { Nav as EriNav, Button, Icon } from "eri";
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
  handleNavClose(): void;
}

export default function Nav({ handleNavClose, open }: Props) {
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    handleNavClose();
  };

  const now = new Date();

  return (
    <>
      <EriNav onClose={handleNavClose} open={open}>
        {userIsSignedIn && (
          <div className="m-nav__header">
            <strong>Signed in</strong>
            <p>
              <small>
                <em>{userEmail}</em>
              </small>
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
        <EriNav.List>
          <EriNav.Link onClick={handleNavClose} to="/">
            <Icon margin="right" name="home" />
            Home
          </EriNav.Link>
          {userIsSignedIn ? (
            <>
              <EriNav.Link onClick={handleNavClose} to="/add">
                <Icon margin="right" name="plus" />
                Add mood
              </EriNav.Link>
              <EriNav.Link onClick={handleNavClose} to="/stats">
                <Icon margin="right" name="chart" />
                Stats
              </EriNav.Link>
              <EriNav.SubList>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/weeks/${formatIsoDateInLocalTimezone(
                    startOfWeek(now, WEEK_OPTIONS)
                  )}`}
                >
                  <Icon margin="right" name="chart" />
                  This week
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/months/${formatIsoMonthInLocalTimezone(now)}`}
                >
                  <Icon margin="right" name="chart" />
                  This month
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/years/${formatIsoYearInLocalTimezone(now)}`}
                >
                  <Icon margin="right" name="chart" />
                  This year
                </EriNav.Link>
                <EriNav.Link onClick={handleNavClose} to="/stats/explore">
                  <Icon margin="right" name="chart" />
                  Explore
                </EriNav.Link>
              </EriNav.SubList>
              <EriNav.Link onClick={handleNavClose} to="/settings">
                <Icon margin="right" name="chart" />
                Settings
              </EriNav.Link>
              <EriNav.SubList>
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/notifications"
                >
                  <Icon margin="right" name="bell" />
                  Notifications
                  <span className="m-nav__new-cta br-1 bw-1 fs-0 ml-1 px-1">
                    New!
                  </span>
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/change-password"
                >
                  <Icon margin="right" name="lock" />
                  Change password
                </EriNav.Link>
                <EriNav.Link onClick={handleNavClose} to="/settings/export">
                  <Icon margin="right" name="download" />
                  Export data
                </EriNav.Link>
              </EriNav.SubList>
            </>
          ) : (
            <EriNav.Link onClick={handleNavClose} to="/sign-in">
              <Icon margin="right" name="key" />
              Sign in
            </EriNav.Link>
          )}
          <EriNav.Link onClick={handleNavClose} to="/blog">
            <Icon margin="right" name="book" />
            Blog
          </EriNav.Link>
          <EriNav.Link onClick={handleNavClose} to="/about">
            <Icon margin="right" name="help" />
            About
          </EriNav.Link>
          <EriNav.Link onClick={handleNavClose} to="/see-also">
            <Icon margin="right" name="link" />
            See also
          </EriNav.Link>
        </EriNav.List>
        {userIsSignedIn && <SyncState />}
      </EriNav>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
