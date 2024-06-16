import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function IntervalInput(props: Props) {
  return <div className="m-interval-input" {...props} />;
}
