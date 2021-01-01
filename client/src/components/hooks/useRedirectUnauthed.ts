import { useNavigate } from "@reach/router";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  userIsSignedInSelector,
} from "../../selectors";

export default function useRedirectUnauthed() {
  const navigate = useNavigate();
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);

  React.useEffect(() => {
    if (!isStorageLoading && !userIsSignedIn) navigate("/");
  }, [isStorageLoading, navigate, userIsSignedIn]);
}
