import { Header, Nav as EriNav, QuickNav, Icon } from "eri";
import * as React from "react";
import Nav from "./Nav";
import useEvents from "./hooks/useEvents";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../selectors";
import AddMoodFab from "./AddMoodFab";
import { TEST_IDS } from "../constants";
import useSettings from "./hooks/useSettings";
import useGeolocation from "./hooks/useGeolocation";
import { Link } from "react-router-dom";

// TODO - throws an exception if we don't assign this first
// Have not figured out the underlying issue
const QuickNavLink = QuickNav.Link;

interface Props {
  children: React.ReactNode;
}

export default function App({ children }: Props) {
  useUser();
  useGeolocation();
  useEvents();
  useSettings();
  useStorage();
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const [isNavOpen, setIsNavOpen] = React.useState(false);

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
      <main>{children}</main>
      <AddMoodFab hide={!userIsSignedIn} />
      {userIsSignedIn && (
        <QuickNav>
          <QuickNavLink aria-label="Home" to="/">
            <Icon name="home" size="3" />
          </QuickNavLink>
          <QuickNavLink aria-label="Statistics" to="/stats">
            <Icon name="chart" size="3" />
          </QuickNavLink>
          <QuickNavLink aria-label="Meditate" to="/meditate">
            <Icon name="bell" size="3" />
          </QuickNavLink>
          <QuickNavLink aria-label="Add new mood" to="/add">
            <Icon name="plus" size="3" />
          </QuickNavLink>
        </QuickNav>
      )}
    </>
  );
}
