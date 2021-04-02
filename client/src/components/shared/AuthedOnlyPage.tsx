import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";
import withStorageLoaded from "../hocs/withStorageLoaded";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
}

function AuthedOnlyPage({ Component, ...rest }: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <Component {...rest} /> : <Redirect to="/401" />;
}

export default withStorageLoaded(AuthedOnlyPage);
