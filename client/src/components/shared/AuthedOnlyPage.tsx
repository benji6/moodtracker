import { Redirect, RouteComponentProps } from "@reach/router";
import { Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  userIsSignedInSelector,
} from "../../selectors";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
}

export default function AuthedOnlyPage({ Component, ...rest }: Props) {
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  return isStorageLoading ? (
    <Spinner />
  ) : userIsSignedIn ? (
    <Component {...rest} />
  ) : (
    <Redirect to="/401" />
  );
}
