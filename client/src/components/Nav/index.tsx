import { startOfWeek } from "date-fns";
import { Nav as EriNav, Button, Icon } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { WEEK_OPTIONS } from "../../formatters/dateTimeFormatters";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../utils";
import SignOutDialog from "./SignOutDialog";
import SyncState from "./SyncState";
import AppIcon from "../../icons/AppIcon";
import "./style.css";
import { TEST_IDS } from "../../constants";
import userSlice from "../../store/userSlice";
import eventsSlice from "../../store/eventsSlice";

interface Props {
  open: boolean;
  handleNavClose(): void;
}

export default function Nav({ handleNavClose, open }: Props) {
  const hasMoods = useSelector(eventsSlice.selectors.hasMoods);
  const hasMeditations = useSelector(eventsSlice.selectors.hasMeditations);
  const hasWeights = useSelector(eventsSlice.selectors.hasWeights);
  const userEmail = useSelector(userSlice.selectors.email);
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
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
              <AppIcon className="br-max bs-0" />
              <b className="m-profile__state">Signed in</b>
              <em className="m-profile__email" title={userEmail}>
                {userEmail}
              </em>
            </div>
            <div className="m-nav__sign-out center">
              <Button
                danger
                data-test-id={TEST_IDS.signOutButton}
                onClick={() => setIsDialogOpen(true)}
                type="button"
                variant="tertiary"
              >
                Sign out
                <Icon name="sign-out" margin="start" />
              </Button>
            </div>
            <hr />
          </div>
        )}
        {userIsSignedIn && <SyncState />}
        <EriNav.List>
          <EriNav.Link onClick={handleNavClose} to="/">
            <Icon margin="end" name="home" />
            Home
          </EriNav.Link>
          {userIsSignedIn ? (
            <>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="end" name="heart" />
                    Mood
                  </span>
                }
              >
                <EriNav.Link onClick={handleNavClose} to="/add">
                  <Icon margin="end" name="plus" />
                  Add
                </EriNav.Link>
                {hasMoods && (
                  <EriNav.Link onClick={handleNavClose} to="/mood/log">
                    <Icon margin="end" name="book" />
                    Log
                  </EriNav.Link>
                )}
              </EriNav.SubList>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="end" name="bell" />
                    Meditation
                  </span>
                }
              >
                <EriNav.Link onClick={handleNavClose} to="/meditation">
                  <Icon margin="end" name="plus" />
                  Add
                </EriNav.Link>
                {hasMeditations && (
                  <EriNav.Link onClick={handleNavClose} to="/meditation/log">
                    <Icon margin="end" name="book" />
                    Log
                  </EriNav.Link>
                )}
              </EriNav.SubList>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="end" name="weight" />
                    Weight
                  </span>
                }
              >
                <EriNav.Link onClick={handleNavClose} to="/weight/add">
                  <Icon margin="end" name="plus" />
                  Add
                </EriNav.Link>
                {hasWeights && (
                  <>
                    <EriNav.Link onClick={handleNavClose} to="/weight/log">
                      <Icon margin="end" name="book" />
                      Log
                    </EriNav.Link>
                  </>
                )}
              </EriNav.SubList>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="end" name="chart" />
                    Stats
                  </span>
                }
              >
                <EriNav.Link onClick={handleNavClose} to="/stats">
                  <Icon margin="end" name="chart" />
                  Overview
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/days/${formatIsoDateInLocalTimezone(now)}`}
                >
                  <Icon margin="end" name="chart" />
                  Today
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/weeks/${formatIsoDateInLocalTimezone(
                    startOfWeek(now, WEEK_OPTIONS),
                  )}`}
                >
                  <Icon margin="end" name="chart" />
                  This week
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/months/${formatIsoMonthInLocalTimezone(now)}`}
                >
                  <Icon margin="end" name="chart" />
                  This month
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to={`/stats/years/${formatIsoYearInLocalTimezone(now)}`}
                >
                  <Icon margin="end" name="chart" />
                  This year
                </EriNav.Link>
                <EriNav.Link onClick={handleNavClose} to="/stats/explore">
                  <Icon margin="end" name="chart" />
                  Explore
                </EriNav.Link>
              </EriNav.SubList>
              <EriNav.SubList
                heading={
                  <span>
                    <Icon margin="end" name="settings" />
                    Settings
                  </span>
                }
              >
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/notifications"
                >
                  <Icon margin="end" name="bell" />
                  Notifications
                </EriNav.Link>
                <EriNav.Link onClick={handleNavClose} to="/settings/location">
                  <Icon margin="end" name="location" />
                  Location
                </EriNav.Link>
                <EriNav.Link onClick={handleNavClose} to="/settings/export">
                  <Icon margin="end" name="download" />
                  Export data
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/change-password"
                >
                  <Icon margin="end" name="lock" />
                  Change password
                </EriNav.Link>
                <EriNav.Link
                  onClick={handleNavClose}
                  to="/settings/change-email"
                >
                  <Icon margin="end" name="at-sign" />
                  Change email
                </EriNav.Link>
              </EriNav.SubList>
            </>
          ) : (
            <EriNav.Link onClick={handleNavClose} to="/sign-in">
              <Icon margin="end" name="key" />
              Sign in
            </EriNav.Link>
          )}
          <EriNav.Link onClick={handleNavClose} to="/blog">
            <Icon margin="end" name="book" />
            Blog
          </EriNav.Link>
          <EriNav.SubList
            heading={
              <span>
                <Icon margin="end" name="help" />
                About
              </span>
            }
          >
            <EriNav.Link onClick={handleNavClose} to="/about">
              <Icon margin="end" name="help" />
              Overview
            </EriNav.Link>
            <EriNav.Link onClick={handleNavClose} to="/about/usage">
              <Icon margin="end" name="chart" />
              Usage
            </EriNav.Link>
            <EriNav.Link onClick={handleNavClose} to="/about/privacy-policy">
              <Icon margin="end" name="eye" />
              Privacy policy
            </EriNav.Link>
          </EriNav.SubList>
          <EriNav.Link onClick={handleNavClose} to="/see-also">
            <Icon margin="end" name="link" />
            See also
          </EriNav.Link>
        </EriNav.List>
      </EriNav>
      <SignOutDialog onClose={handleDialogClose} open={isDialogOpen} />
    </>
  );
}
