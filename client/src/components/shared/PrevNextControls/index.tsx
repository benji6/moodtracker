import * as React from "react";
import "./style.css";

export default function PrevNextControls(
  props: React.HtmlHTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} className="m-prev-next-controls" />;
}
