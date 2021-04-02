import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";
import withStorageLoaded from "../hocs/withStorageLoaded";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
}

function UnauthedOnlyPage({ Component, ...rest }: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <Redirect to="/404" /> : <Component {...rest} />;
}

export default withStorageLoaded(UnauthedOnlyPage);
