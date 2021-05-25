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

function UnauthedOnlyPage(props: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <Redirect to="/404" /> : <Page {...props} />;
}

export default withStorageLoaded(UnauthedOnlyPage);
