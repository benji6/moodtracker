import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";
import withStorageLoaded from "../hocs/withStorageLoaded";
import { Page } from "./Page";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
  title: string;
}

function AuthedOnlyPage(props: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <Page {...props} /> : <Redirect to="/401" />;
}

export default withStorageLoaded(AuthedOnlyPage);
