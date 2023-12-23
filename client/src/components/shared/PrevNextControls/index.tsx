import "./style.css";
import * as React from "react";

export default function PrevNextControls(
  props: React.HtmlHTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} className="m-prev-next-controls" />;
}
