import { RouteComponentProps } from "@reach/router";
import * as React from "react";

interface Props extends RouteComponentProps {
  Component: React.ComponentType<RouteComponentProps>;
  title: string;
}

export function Page({ Component, title, ...rest }: Props) {
  React.useEffect(() => {
    document.title = `MoodTracker - ${title}`;
  });
  return <Component {...rest} />;
}
