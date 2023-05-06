import * as React from "react";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../selectors";
import withStorageLoaded from "../hocs/withStorageLoaded";
import RedirectHome from "./RedirectHome";
import { Page } from "./Page";

interface Props {
  Component: React.ComponentType;
  title: string;
}

function UnauthedOnlyPage(props: Props) {
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  return userIsSignedIn ? <RedirectHome /> : <Page {...props} />;
}

export default withStorageLoaded(UnauthedOnlyPage);
