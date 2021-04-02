import { Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { appIsStorageLoadingSelector } from "../../selectors";

export default function withStorageLoaded<P>(
  Component: React.ComponentType<P>
) {
  return function WithStorageLoaded(props: P) {
    const isStorageLoading = useSelector(appIsStorageLoadingSelector);
    return isStorageLoading ? <Spinner /> : <Component {...props} />;
  };
}
