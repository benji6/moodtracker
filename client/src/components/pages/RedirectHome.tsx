import { Redirect, RouteComponentProps } from "@reach/router";

export default function RedirectHome(_: RouteComponentProps) {
  return <Redirect to="/" />;
}
