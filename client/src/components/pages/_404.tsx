import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";

export default function _404(_: RouteComponentProps) {
  return <Redirect to="/" />;
}
