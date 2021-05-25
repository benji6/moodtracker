import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";

export default function RedirectHome(_: RouteComponentProps) {
  return <Redirect to="/" />;
}
