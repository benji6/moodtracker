import { Link } from "@reach/router";
import { Header, Menu as EriMenu, Main, Spinner, QuickNav, Icon } from "eri";
import * as React from "react";
import Menu from "./Menu";
import Router from "./Router";
import useEvents from "./hooks/useEvents";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import { useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  userIsSignedInSelector,
} from "../selectors";

export default function App() {
  useUser();
  useEvents();
  useStorage();
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <>
      <Header>
        <h1>
          <Link to="/">MoodTracker</Link>
        </h1>
        <EriMenu.Button
          data-test-id="menu-button"
          onClick={() => setIsMenuOpen(true)}
        />
      </Header>
      <Menu handleMenuClose={() => setIsMenuOpen(false)} open={isMenuOpen} />
      <Main>{isStorageLoading ? <Spinner /> : <Router />}</Main>
      {userIsSignedIn && (
        <QuickNav>
          <QuickNav.Link aria-label="home" to="/">
            <Icon name="home" size="4" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="statistics" to="/stats">
            <Icon name="chart" size="4" />
          </QuickNav.Link>
          <QuickNav.Link aria-label="add new mood" to="/add">
            <Icon name="plus" size="4" />
          </QuickNav.Link>
        </QuickNav>
      )}
    </>
  );
}
