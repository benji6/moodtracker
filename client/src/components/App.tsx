import { Link, RouteComponentProps } from "@reach/router";
import { Header, Nav as EriNav, Main, QuickNav, Icon } from "eri";
import * as React from "react";
import Nav from "./Nav";
import useEvents from "./hooks/useEvents";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../selectors";
import AddMoodFab from "./AddMoodFab";
import { TEST_IDS } from "../constants";

interface IProps extends RouteComponentProps {
  children: React.ReactNode;
}

export default function App({ children }: IProps) {
  useUser();
  useEvents();
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
      <Main>{children}</Main>
      <AddMoodFab hide={!userIsSignedIn} />
      {userIsSignedIn && (
        <QuickNav>
          <QuickNav.Link aria-label="Home" to="/">
            <Icon name="home" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Statistics" to="/stats">
            <Icon name="chart" size="3" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="Add new mood" to="/add">
            <Icon name="plus" size="3" />
          </QuickNav.Link>
        </QuickNav>
      )}
    </>
  );
}
