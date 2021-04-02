import { RouteComponentProps } from "@reach/router";
import * as React from "react";
import withStorageLoaded from "../hocs/withStorageLoaded";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
}

function StorageLoadedPage({ Component, ...rest }: Props) {
  return <Component {...rest} />;
}

export default withStorageLoaded(StorageLoadedPage);
