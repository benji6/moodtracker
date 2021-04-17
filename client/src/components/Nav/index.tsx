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
import MoodTrackerIcon from "../../icons/Icon";
import "./style.css";
import { TEST_IDS } from "../../constants";

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
            <div className="m-profile">
              <MoodTrackerIcon className="br-max bs-0" />
              <div className="m-profile__text-container">
                <b>Signed in</b>
                <small>
                  <em>{userEmail}</em>
                </small>
              </div>
            </div>
            <div className="center my-3">
              <Button
                danger
                data-test-id={TEST_IDS.signOutButton}
                onClick={() => setIsDialogOpen(true)}
                type="button"
                variant="tertiary"
              >
                Sign out
                <Icon name="sign-out" margin="left" />
              </Button>
            </div>
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
              <EriNav.Link onClick={handleNavClose} to="/meditate">
                <Icon margin="right" name="bell" />
                Meditate
              </EriNav.Link>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="right" name="chart" />
                    Stats
                  </span>
                }
              >
                <EriNav.Link onClick={handleNavClose} to="/stats">
                  <Icon margin="right" name="chart" />
                  Overview
                </EriNav.Link>
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
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="right" name="settings" />
                    Settings
                  </span>
                }
              >
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/notifications"
                >
                  <Icon margin="right" name="bell" />
                  Notifications
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
