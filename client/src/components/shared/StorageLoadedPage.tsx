import * as React from "react";
import { Page } from "./Page";
import { useSelector } from "react-redux";
import { appIsStorageLoadingSelector } from "../../selectors";
import { Spinner } from "eri";

interface Props {
  Component: React.ComponentType;
  title: string;
}

export default function StorageLoadedPage(props: Props) {
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  return isStorageLoading ? <Spinner /> : <Page {...props} />;
}
