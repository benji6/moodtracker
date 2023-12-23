import { ComponentType, useEffect } from "react";

interface Props {
  Component: ComponentType;
  title: string;
}

export default function Page({ Component, title, ...rest }: Props) {
  useEffect(() => {
    document.title = `MoodTracker - ${title}`;
  }, [title]);
  return <Component {...rest} />;
}
