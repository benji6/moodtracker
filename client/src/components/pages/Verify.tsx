import { RouteComponentProps } from "@reach/router";
import { Spinner, VerifyPage } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { appIsStorageLoadingSelector } from "../../selectors";
import useRedirectAuthed from "../hooks/useRedirectAuthed";

export default function Verify(_: RouteComponentProps) {
  useRedirectAuthed();
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  return <VerifyPage appName="MoodTracker" />;
}
