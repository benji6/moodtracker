import { Link } from "@reach/router";
import { Header, Menu as EriMenu, Main, Spinner } from "eri";
import * as React from "react";
import Menu from "./Menu";
import Router from "./Router";
import useEvents from "./hooks/useEvents";
import useStorage from "./hooks/useStorage";
import useUser from "./hooks/useUser";
import { StateContext } from "./AppState";

export default function App() {
  useUser();
  useEvents();
  useStorage();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const state = React.useContext(StateContext);

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
      <Main>{state.isStorageLoading ? <Spinner /> : <Router />}</Main>
    </>
  );
}
