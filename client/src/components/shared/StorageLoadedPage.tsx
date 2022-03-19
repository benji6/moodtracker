import * as React from "react";
import withStorageLoaded from "../hocs/withStorageLoaded";
import { Page } from "./Page";

interface Props {
  Component: React.ComponentType;
  title: string;
}

function StorageLoadedPage(props: Props) {
  return <Page {...props} />;
}

export default withStorageLoaded(StorageLoadedPage);
