import { Redirect, RouteComponentProps } from "@reach/router";
import * as React from "react";

export default function _401(_: RouteComponentProps) {
  return <Redirect to="/" />;
}
