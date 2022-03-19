import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";
import withStorageLoaded from "../hocs/withStorageLoaded";
import RedirectHome from "../pages/RedirectHome";
import { Page } from "./Page";

interface Props {
  Component: React.ComponentType;
  title: string;
}

function AuthedOnlyPage(props: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <Page {...props} /> : <RedirectHome />;
}

export default withStorageLoaded(AuthedOnlyPage);
