import { Nav as EriNav, Header, Icon, QuickNav } from "eri";
import { Link, Outlet } from "react-router-dom";
import AddMoodFab from "./shared/AddMoodFab";
import Nav from "./Nav";
import { TEST_IDS } from "../constants";
import useEvents from "./hooks/useEvents";
import useGeolocation from "./hooks/useGeolocation";
import { useSelector } from "react-redux";
import { useSentryUser } from "../sentry";
import { useShuffleBackgroundMesh } from "./hooks/useShuffleBackgroundMesh";
import { useState } from "react";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import userSlice from "../store/userSlice";

export default function Layout() {
  useShuffleBackgroundMesh();
  useUser();
  useGeolocation();
  useEvents();
  useStorage();
  useSentryUser();
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <>
      <Header>
        <h1>
          <Link to="/">MoodTracker</Link>
        </h1>
        <EriNav.Button
          data-test-id={TEST_IDS.navButton}
          onClick={() => setIsNavOpen(true)}
        />
      </Header>
      <Nav handleNavClose={() => setIsNavOpen(false)} open={isNavOpen} />
      <main>
        <Outlet />
      </main>
      <AddMoodFab hide={!userIsSignedIn} />
      {userIsSignedIn && (
        <QuickNav>
          <QuickNav.Link aria-label="Home" to="/">
            <Icon name="home" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Statistics" to="/stats">
            <Icon name="chart" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Meditate" to="/meditation">
            <Icon name="bell" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Add new mood" to="/add">
            <Icon name="heart" size="3" />
          </QuickNav.Link>
        </QuickNav>
      )}
    </>
  );
}
