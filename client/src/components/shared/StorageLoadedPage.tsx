import { RouteComponentProps } from "@reach/router";
import * as React from "react";
import withStorageLoaded from "../hocs/withStorageLoaded";
import { Page } from "./Page";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
  title: string;
}

function StorageLoadedPage(props: Props) {
  return <Page {...props} />;
}

export default withStorageLoaded(StorageLoadedPage);
