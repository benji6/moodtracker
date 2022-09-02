import { Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { appIsStorageLoadingSelector } from "../../selectors";

// TODO probably a nicer way of writing this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function withStorageLoaded<P extends Record<string, any>>(
  Component: React.ComponentType<P>
) {
  return function WithStorageLoaded(props: P) {
    const isStorageLoading = useSelector(appIsStorageLoadingSelector);
    return isStorageLoading ? <Spinner /> : <Component {...props} />;
  };
}
